#!/usr/bin/env python3
"""
Integration test script for Lighthouse backend API
Tests all authentication endpoints and verifies CORS configuration
"""

import requests
import json
from typing import Dict, Optional

# Configuration
BASE_URL = "http://localhost:8002"
API_BASE = f"{BASE_URL}/api/v1"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


def print_test(name: str):
    """Print test name"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST: {name}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")


def print_success(message: str):
    """Print success message"""
    print(f"{GREEN}✓ {message}{RESET}")


def print_error(message: str):
    """Print error message"""
    print(f"{RED}✗ {message}{RESET}")


def print_info(message: str):
    """Print info message"""
    print(f"{YELLOW}ℹ {message}{RESET}")


def test_health_check():
    """Test health check endpoint"""
    print_test("Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/healthz")
        data = response.json()
        
        if response.status_code == 200 and data.get("status") == "ok":
            print_success(f"Health check passed: {json.dumps(data, indent=2)}")
            return True
        else:
            print_error(f"Health check failed: {data}")
            return False
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False


def test_cors_headers():
    """Test CORS configuration"""
    print_test("CORS Configuration")
    
    try:
        # Test preflight request
        headers = {
            'Origin': 'http://localhost:3000',
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
        
        print_info(f"CORS Headers: {json.dumps(cors_headers, indent=2)}")
        
        if cors_headers['Access-Control-Allow-Origin']:
            print_success("CORS is properly configured")
            return True
        else:
            print_error("CORS headers not found")
            return False
            
    except Exception as e:
        print_error(f"CORS test error: {str(e)}")
        return False


def test_signup():
    """Test user signup"""
    print_test("User Signup")
    
    try:
        # Create a unique test user
        import time
        timestamp = int(time.time())
        
        payload = {
            "name": f"Integration Test User {timestamp}",
            "email": f"test_{timestamp}@example.com",
            "password": "testpass123"
        }
        
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Signup successful!")
            print_info(f"User ID: {data['user']['id']}")
            print_info(f"User Name: {data['user']['name']}")
            print_info(f"User Email: {data['user']['email']}")
            print_info(f"User Role: {data['user']['role']}")
            print_info(f"Token received: {data['token'][:50]}...")
            return data
        else:
            print_error(f"Signup failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print_error(f"Signup error: {str(e)}")
        return None


def test_login(email: str, password: str):
    """Test user login"""
    print_test("User Login")
    
    try:
        payload = {
            "email": email,
            "password": password
        }
        
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Login successful!")
            print_info(f"User ID: {data['user']['id']}")
            print_info(f"Token received: {data['token'][:50]}...")
            return data
        else:
            print_error(f"Login failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print_error(f"Login error: {str(e)}")
        return None


def test_get_current_user(token: str):
    """Test getting current user info"""
    print_test("Get Current User (Protected Route)")
    
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(f"{API_BASE}/auth/me", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Successfully retrieved user info!")
            print_info(f"User: {json.dumps(data, indent=2)}")
            return data
        else:
            print_error(f"Get user failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print_error(f"Get user error: {str(e)}")
        return None


def test_logout(token: str):
    """Test user logout"""
    print_test("User Logout")
    
    try:
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(f"{API_BASE}/auth/logout", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Logout successful: {data.get('message')}")
            return True
        else:
            print_error(f"Logout failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Logout error: {str(e)}")
        return False


def test_invalid_token():
    """Test with invalid token"""
    print_test("Invalid Token Test")
    
    try:
        headers = {
            'Authorization': 'Bearer invalid_token_here',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(f"{API_BASE}/auth/me", headers=headers)
        
        if response.status_code == 401:
            print_success("Invalid token correctly rejected (401)")
            return True
        else:
            print_error(f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Invalid token test error: {str(e)}")
        return False


def main():
    """Run all integration tests"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}LIGHTHOUSE BACKEND INTEGRATION TESTS{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    
    results = []
    
    # Test 1: Health Check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: CORS Configuration
    results.append(("CORS Configuration", test_cors_headers()))
    
    # Test 3: Signup
    signup_data = test_signup()
    results.append(("User Signup", signup_data is not None))
    
    if signup_data:
        email = signup_data['user']['email']
        password = "testpass123"
        
        # Test 4: Login
        login_data = test_login(email, password)
        results.append(("User Login", login_data is not None))
        
        if login_data:
            token = login_data['token']
            
            # Test 5: Get Current User
            results.append(("Get Current User", test_get_current_user(token) is not None))
            
            # Test 6: Invalid Token
            results.append(("Invalid Token Rejection", test_invalid_token()))
            
            # Test 7: Logout
            results.append(("User Logout", test_logout(token)))
    
    # Print Summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
        print(f"{test_name}: {status}")
    
    print(f"\n{BLUE}Total: {passed}/{total} tests passed{RESET}")
    
    if passed == total:
        print(f"{GREEN}✓ All tests passed!{RESET}\n")
        return 0
    else:
        print(f"{RED}✗ Some tests failed{RESET}\n")
        return 1


if __name__ == "__main__":
    exit(main())
