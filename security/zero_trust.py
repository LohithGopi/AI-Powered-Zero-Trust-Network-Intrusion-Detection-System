from functools import wraps
from flask import jsonify, request, g, redirect, url_for
from security.jwt_auth import get_token_from_request, decode_token
from utils.logger import log_audit_event

def jwt_required(f):
    """Zero Trust Decorator: Enforce mandatory token verification on API endpoints."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            log_audit_event(
                action="UNAUTHORIZED_ACCESS_ATTEMPT",
                status="REJECTED",
                ip_address=request.remote_addr,
                details=f"Missing JWT Token for path {request.path}"
            )
            if request.path.startswith("/api/"):
                return jsonify({"error": "Unauthorized. JWT Token required."}), 401
            return redirect(url_for("auth.login_page"))

        payload = decode_token(token)
        if "error" in payload:
            log_audit_event(
                action="EXPIRED_OR_INVALID_TOKEN",
                status="REJECTED",
                ip_address=request.remote_addr,
                details=f"Token error: {payload['error']} for path {request.path}"
            )
            if request.path.startswith("/api/"):
                return jsonify({"error": f"Unauthorized. {payload['error']}"}), 401
            return redirect(url_for("auth.login_page"))

        # Set user context in Flask 'g'
        g.user = payload
        return f(*args, **kwargs)

    return decorated

def require_role(allowed_roles):
    """Zero Trust Decorator: Role-Based Access Control (RBAC) enforcement."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = get_token_from_request()
            if not token:
                return jsonify({"error": "Authentication required."}), 401

            payload = decode_token(token)
            if "error" in payload:
                return jsonify({"error": payload["error"]}), 401

            user_role = payload.get("role")
            if user_role not in allowed_roles:
                log_audit_event(
                    action="RBAC_ACCESS_DENIED",
                    status="REJECTED",
                    user_id=payload.get("user_id"),
                    username=payload.get("username"),
                    ip_address=request.remote_addr,
                    details=f"Role '{user_role}' denied access to {request.path}. Required: {allowed_roles}"
                )
                if request.path.startswith("/api/"):
                    return jsonify({"error": "Forbidden. Insufficient permissions."}), 403
                return jsonify({"error": "Access Denied. You do not have permissions for this page."}), 403

            g.user = payload
            return f(*args, **kwargs)

        return decorated
    return decorator
