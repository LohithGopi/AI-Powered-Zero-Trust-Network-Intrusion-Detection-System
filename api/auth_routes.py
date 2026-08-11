from flask import Blueprint, request, jsonify, make_response, render_template, redirect, url_for, g
from database.init_db import db, User, Role
from security.password import hash_password, check_password
from security.jwt_auth import generate_token
from utils.logger import log_audit_event

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")

@auth_bp.route("/register", methods=["GET"])
def register_page():
    roles = Role.query.all()
    return render_template("register.html", roles=roles)

@auth_bp.route("/forgot-password", methods=["GET"])
def forgot_password_page():
    return render_template("forgot_password.html")


@auth_bp.route("/api/register", methods=["POST"])
@auth_bp.route("/api/auth/register", methods=["POST"])
def register_api():
    data = request.get_json() or request.form
    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role_name = data.get("role", "User")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required."}), 400

    # Check if user already exists
    if User.query.filter((User.username == username) | (User.email == email)).first():
        log_audit_event(
            action="USER_REGISTRATION",
            status="FAILED",
            username=username,
            ip_address=request.remote_addr,
            details="Username or email already exists."
        )
        return jsonify({"error": "User with this username or email already exists."}), 400

    # Get requested role
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        role = Role.query.filter_by(name="User").first()

    # Create new user
    new_user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
        role_id=role.id
    )
    db.session.add(new_user)
    db.session.commit()

    log_audit_event(
        action="USER_REGISTRATION",
        status="SUCCESS",
        user_id=new_user.id,
        username=username,
        ip_address=request.remote_addr,
        details=f"Registered user with role '{role.name}'"
    )

    return jsonify({"message": "Registration successful. Please log in.", "user": new_user.to_dict()}), 201

@auth_bp.route("/api/login", methods=["POST"])
@auth_bp.route("/api/auth/login", methods=["POST"])
def login_api():
    data = request.get_json() or request.form
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not check_password(password, user.password_hash):
        log_audit_event(
            action="USER_LOGIN",
            status="FAILED",
            username=username,
            ip_address=request.remote_addr,
            details="Invalid username or password credentials."
        )
        return jsonify({"error": "Invalid username or password."}), 401

    # Generate JWT Token
    role_name = user.role.name if user.role else "User"
    token = generate_token(user_id=user.id, username=user.username, role=role_name)

    log_audit_event(
        action="USER_LOGIN",
        status="SUCCESS",
        user_id=user.id,
        username=user.username,
        ip_address=request.remote_addr,
        details=f"Authenticated as '{role_name}' role."
    )

    response = make_response(jsonify({
        "message": "Login successful",
        "token": token,
        "username": user.username,
        "role": role_name,
        "user": user.to_dict()
    }))

    # Set HTTP-only Cookie for web browser navigation ease
    response.set_cookie("jwt_token", token, httponly=True, samesite="Lax")
    return response, 200

@auth_bp.route("/logout", methods=["GET", "POST"])
def logout():
    log_audit_event(
        action="USER_LOGOUT",
        status="SUCCESS",
        ip_address=request.remote_addr,
        details="User logged out."
    )
    response = make_response(redirect(url_for("auth.login_page")))
    response.set_cookie("jwt_token", "", expires=0)
    return response

@auth_bp.route("/api/forgot-password", methods=["POST"])
@auth_bp.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password_api():
    data = request.get_json() or request.form
    identifier = data.get("identifier", "").strip()  # Username or Email
    new_password = data.get("new_password", "")

    if not identifier or not new_password:
        return jsonify({"error": "Username/Email and new password are required."}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if not user:
        log_audit_event(
            action="PASSWORD_RESET_ATTEMPT",
            status="FAILED",
            username=identifier,
            ip_address=request.remote_addr,
            details="User not found for password reset."
        )
        return jsonify({"error": "No account found matching that username or email."}), 404

    user.password_hash = hash_password(new_password)
    db.session.commit()

    log_audit_event(
        action="PASSWORD_RESET",
        status="SUCCESS",
        user_id=user.id,
        username=user.username,
        ip_address=request.remote_addr,
        details="Password reset successfully."
    )

    return jsonify({"message": "Password reset successful. Please sign in with your new password."}), 200
