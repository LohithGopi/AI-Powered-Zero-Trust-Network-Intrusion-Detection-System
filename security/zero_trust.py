from functools import wraps
from flask import jsonify, request, g, redirect, url_for
from security.jwt_auth import get_token_from_request, decode_token
from utils.logger import log_audit_event

def jwt_required(f):
    """Zero Trust Decorator: Mandatory user context verification on API endpoints."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        payload = decode_token(token)
        
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
            payload = decode_token(token)
            
            user_role = payload.get("role", "Admin")
            if user_role not in allowed_roles:
                log_audit_event(
                    action="RBAC_ACCESS_DENIED",
                    status="REJECTED",
                    user_id=payload.get("user_id"),
                    username=payload.get("username"),
                    ip_address=request.remote_addr,
                    details=f"Role '{user_role}' denied access to {request.path}. Allowed: {allowed_roles}"
                )
                return jsonify({"error": f"Role restriction: Allowed roles are {allowed_roles}"}), 403

            g.user = payload
            return f(*args, **kwargs)

        return decorated
    return decorator
