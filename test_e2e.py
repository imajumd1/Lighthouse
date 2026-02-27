#!/usr/bin/env python3
"""
End-to-End Test Suite for Lighthouse Application
Tests the complete flow from frontend to backend integration
"""

import requests
import json
import time
from typing import Dict, Optional

# Configuration
BACKEND_URL = "http://localhost:8002"
FRONTEND_URL = "http://localhost:3000"
API_BASE = f"{BACKEND_URL}/api/v1"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
CYAN = '\033[96m'
MAGENTA = '\033[95m'
RESET = '\033[0m'


def print_header(text: str):
    """Print section header"""
    print(f"\n{CYAN}{'='*70}{RESET}")
    print(f"{CYAN}{text.center(70)}{RESET}")
    print(f"{CYAN}{'='*70}{RESET}")


def print_test(name: str):
    """Print test name"""
    print(f"\n{BLUE}{'─'*70}{RESET}")
    print(f"{BLUE}TEST: {name}{RESET}")
    print(f"{BLUE}{'─'*70}{RESET}")


def print_success(message: str):
    """Print success message"""
    print(f"{GREEN}✓ {message}{RESET}")


def print_error(message: str):
    """Print error message"""
    print(f"{RED}✗ {message}{RESET}")


def print_info(message: str):
    """Print info message"""
    print(f"{YELLOW}ℹ {message}{RESET}")


def print_data(label: str, data: any):
    """Print formatted data"""
    print(f"{MAGENTA}{label}:{RESET}")
    print(f"{YELLOW}{json.dumps(data, indent=2)}{RESET}")


# ============================================================================
# INFRASTRUCTURE TESTS
# ============================================================================

def test_frontend_running():
    """Test if frontend server is running"""
    print_test("Frontend Server Status")
    
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        
        if response.status_code == 200:
            print_success(f"Frontend is running on {FRONTEND_URL}")
            print_info(f"Response size: {len(response.content)} bytes")
            return True
        else:
            print_error(f"Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"Cannot connect to frontend at {FRONTEND_URL}")
        print_info("Make sure the frontend server is running: npm run dev")
        return False
    except Exception as e:
        print_error(f"Frontend check error: {str(e)}")
        return False


def test_backend_running():
    """Test if backend server is running"""
    print_test("Backend Server Status")
    
    try:
        response = requests.get(f"{BACKEND_URL}/healthz", timeout=5)
        data = response.json()
        
        if response.status_code == 200 and data.get("status") == "ok":
            print_success(f"Backend is running on {BACKEND_URL}")
            print_data("Health Check Response", data)
            return True
        else:
            print_error(f"Backend health check failed: {data}")
            return False
    except requests.exceptions.ConnectionError:
        print_error(f"Cannot connect to backend at {BACKEND_URL}")
        print_info("Make sure the backend server is running: uvicorn main:app --reload --port 8002")
        return False
    except Exception as e:
        print_error(f"Backend check error: {str(e)}")
        return False


def test_cors_configuration():
    """Test CORS configuration for frontend-backend communication"""
    print_test("CORS Configuration")
    
    try:
        headers = {
            'Origin': FRONTEND_URL,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type,Authorization'
        }
        
        response = requests.options(f"{API_BASE}/auth/login", headers=headers)
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
            'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
        }
        
        print_data("CORS Headers", cors_headers)
        
        if cors_headers['Access-Control-Allow-Origin']:
            print_success("CORS is properly configured for frontend-backend communication")
            return True
        else:
            print_error("CORS headers not found - frontend may not be able to communicate with backend")
            return False
            
    except Exception as e:
        print_error(f"CORS test error: {str(e)}")
        return False


# ============================================================================
# AUTHENTICATION FLOW TESTS
# ============================================================================

def test_user_signup():
    """Test complete user signup flow"""
    print_test("User Signup Flow")
    
    try:
        timestamp = int(time.time())
        
        payload = {
            "name": f"E2E Test User {timestamp}",
            "email": f"e2e_test_{timestamp}@lighthouse.com",
            "password": "SecurePass123!"
        }
        
        print_info(f"Creating user: {payload['email']}")
        
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            headers={
                'Content-Type': 'application/json',
                'Origin': FRONTEND_URL
            }
        )
        
        if response.status_code == 201:
            data = response.json()
            print_success("User signup successful!")
            print_data("User Data", {
                "id": data['user']['id'],
                "name": data['user']['name'],
                "email": data['user']['email'],
                "role": data['user']['role']
            })
            print_info(f"JWT Token: {data['token'][:50]}...")
            return {
                'user': data['user'],
                'token': data['token'],
                'email': payload['email'],
                'password': payload['password']
            }
        else:
            print_error(f"Signup failed: {response.status_code}")
            print_data("Error Response", response.json())
            return None
            
    except Exception as e:
        print_error(f"Signup error: {str(e)}")
        return None


def test_user_login(email: str, password: str):
    """Test user login flow"""
    print_test("User Login Flow")
    
    try:
        payload = {
            "email": email,
            "password": password
        }
        
        print_info(f"Logging in as: {email}")
        
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            headers={
                'Content-Type': 'application/json',
                'Origin': FRONTEND_URL
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success("Login successful!")
            print_data("User Data", {
                "id": data['user']['id'],
                "name": data['user']['name'],
                "email": data['user']['email'],
                "role": data['user']['role']
            })
            print_info(f"JWT Token: {data['token'][:50]}...")
            return data
        else:
            print_error(f"Login failed: {response.status_code}")
            print_data("Error Response", response.json())
            return None
            
    except Exception as e:
        print_error(f"Login error: {str(e)}")
        return None


def test_protected_route(token: str):
    """Test accessing protected route with JWT token"""
    print_test("Protected Route Access (Get Current User)")
    
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Origin': FRONTEND_URL
        }
        
        response = requests.get(f"{API_BASE}/auth/me", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Successfully accessed protected route!")
            print_data("User Profile", data)
            return data
        else:
            print_error(f"Protected route access failed: {response.status_code}")
            print_data("Error Response", response.json())
            return None
            
    except Exception as e:
        print_error(f"Protected route error: {str(e)}")
        return None


def test_invalid_token():
    """Test that invalid tokens are rejected"""
    print_test("Invalid Token Rejection")
    
    try:
        headers = {
            'Authorization': 'Bearer invalid_token_12345',
            'Content-Type': 'application/json',
            'Origin': FRONTEND_URL
        }
        
        response = requests.get(f"{API_BASE}/auth/me", headers=headers)
        
        if response.status_code == 401:
            print_success("Invalid token correctly rejected with 401 Unauthorized")
            return True
        else:
            print_error(f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Invalid token test error: {str(e)}")
        return False


def test_logout(token: str):
    """Test user logout"""
    print_test("User Logout Flow")
    
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'Origin': FRONTEND_URL
        }
        
        response = requests.post(f"{API_BASE}/auth/logout", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Logout successful: {data.get('message')}")
            return True
        else:
            print_error(f"Logout failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Logout error: {str(e)}")
        return False


# ============================================================================
# FRONTEND PAGE TESTS
# ============================================================================

def test_frontend_pages():
    """Test that key frontend pages are accessible"""
    print_test("Frontend Pages Accessibility")
    
    pages = [
        ('/', 'Home Page'),
        ('/login', 'Login Page'),
        ('/register', 'Register Page'),
    ]
    
    results = []
    
    for path, name in pages:
        try:
            response = requests.get(f"{FRONTEND_URL}{path}", timeout=5)
            if response.status_code == 200:
                print_success(f"{name} ({path}) - Accessible")
                results.append(True)
            else:
                print_error(f"{name} ({path}) - Status {response.status_code}")
                results.append(False)
        except Exception as e:
            print_error(f"{name} ({path}) - Error: {str(e)}")
            results.append(False)
    
    return all(results)


# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    """Run all E2E tests"""
    print_header("LIGHTHOUSE END-TO-END TEST SUITE")
    print(f"{CYAN}Testing complete integration from frontend to backend{RESET}")
    print(f"{CYAN}Frontend: {FRONTEND_URL}{RESET}")
    print(f"{CYAN}Backend: {BACKEND_URL}{RESET}")
    
    results = []
    
    # Phase 1: Infrastructure Tests
    print_header("PHASE 1: INFRASTRUCTURE TESTS")
    results.append(("Frontend Server Running", test_frontend_running()))
    results.append(("Backend Server Running", test_backend_running()))
    results.append(("CORS Configuration", test_cors_configuration()))
    
    # Phase 2: Frontend Pages
    print_header("PHASE 2: FRONTEND PAGES")
    results.append(("Frontend Pages Accessible", test_frontend_pages()))
    
    # Phase 3: Authentication Flow
    print_header("PHASE 3: AUTHENTICATION FLOW")
    
    # Signup
    signup_data = test_user_signup()
    results.append(("User Signup", signup_data is not None))
    
    if signup_data:
        email = signup_data['email']
        password = signup_data['password']
        signup_token = signup_data['token']
        
        # Login
        login_data = test_user_login(email, password)
        results.append(("User Login", login_data is not None))
        
        if login_data:
            token = login_data['token']
            
            # Protected Route
            results.append(("Protected Route Access", test_protected_route(token) is not None))
            
            # Invalid Token
            results.append(("Invalid Token Rejection", test_invalid_token()))
            
            # Logout
            results.append(("User Logout", test_logout(token)))
    
    # Print Final Summary
    print_header("TEST SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\n{BLUE}{'Test Name':<40} {'Status':<10}{RESET}")
    print(f"{BLUE}{'-'*50}{RESET}")
    
    for test_name, result in results:
        status = f"{GREEN}✓ PASS{RESET}" if result else f"{RED}✗ FAIL{RESET}"
        print(f"{test_name:<40} {status}")
    
    print(f"\n{BLUE}{'─'*50}{RESET}")
    print(f"{BLUE}Total: {passed}/{total} tests passed ({(passed/total*100):.1f}%){RESET}")
    print(f"{BLUE}{'─'*50}{RESET}\n")
    
    if passed == total:
        print(f"{GREEN}{'='*50}{RESET}")
        print(f"{GREEN}✓ ALL E2E TESTS PASSED!{RESET}")
        print(f"{GREEN}The Lighthouse application is fully functional.{RESET}")
        print(f"{GREEN}{'='*50}{RESET}\n")
        return 0
    else:
        print(f"{RED}{'='*50}{RESET}")
        print(f"{RED}✗ SOME TESTS FAILED{RESET}")
        print(f"{RED}{total - passed} test(s) need attention.{RESET}")
        print(f"{RED}{'='*50}{RESET}\n")
        return 1


if __name__ == "__main__":
    exit(main())
