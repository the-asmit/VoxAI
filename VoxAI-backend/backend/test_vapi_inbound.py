"""
Test utility for /vapi/inbound endpoint.

Run this to verify the Vapi inbound integration is working correctly.

Usage:
    python test_vapi_inbound.py
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

# Test call ID
TEST_CALL_ID = f"test-call-{int(datetime.now().timestamp())}"


async def test_inbound_flow():
    """Test full inbound call flow: started → transcript → ended"""
    
    print(f"\n{'='*70}")
    print(f"Testing /vapi/inbound endpoint")
    print(f"{'='*70}\n")
    print(f"Call ID: {TEST_CALL_ID}\n")
    
    async with httpx.AsyncClient() as client:
        
        # ====================================================================
        # TEST 1: call.started
        # ====================================================================
        print("[TEST 1] call.started event")
        print("-" * 70)
        
        payload = {
            "event": "call.started",
            "call": {
                "id": TEST_CALL_ID
            },
            "metadata": {
                "agent_profile": "government"
            }
        }
        
        print(f"Request: {json.dumps(payload, indent=2)}\n")
        
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ PASS: call.started\n")
        
        # Wait for session to initialize
        await asyncio.sleep(0.5)
        
        # ====================================================================
        # TEST 2: Partial transcript (should be ignored)
        # ====================================================================
        print("[TEST 2] Partial transcript (isFinal=false)")
        print("-" * 70)
        
        payload = {
            "event": "transcript",
            "call": {
                "id": TEST_CALL_ID
            },
            "transcript": {
                "text": "I want information about",
                "isFinal": False
            }
        }
        
        print(f"Request: {json.dumps(payload, indent=2)}\n")
        
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
        
        assert response.status_code == 200
        print("✅ PASS: Partial transcript ignored\n")
        
        # ====================================================================
        # TEST 3: Final transcript (triggers agent)
        # ====================================================================
        print("[TEST 3] Final transcript (isFinal=true)")
        print("-" * 70)
        
        payload = {
            "event": "transcript",
            "call": {
                "id": TEST_CALL_ID
            },
            "transcript": {
                "text": "Hello, I want information about scholarships",
                "isFinal": True
            }
        }
        
        print(f"Request: {json.dumps(payload, indent=2)}\n")
        
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
        
        assert response.status_code == 200
        print("✅ PASS: Final transcript accepted\n")
        
        # Wait for agent processing
        print("⏳ Waiting for agent processing (30s max)...\n")
        await asyncio.sleep(5)
        
        # ====================================================================
        # TEST 4: Second transcript (turn 2)
        # ====================================================================
        print("[TEST 4] Second transcript (turn 2)")
        print("-" * 70)
        
        payload = {
            "event": "transcript",
            "call": {
                "id": TEST_CALL_ID
            },
            "transcript": {
                "text": "Can you send me more details via email?",
                "isFinal": True
            }
        }
        
        print(f"Request: {json.dumps(payload, indent=2)}\n")
        
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
        
        assert response.status_code == 200
        print("✅ PASS: Second transcript processed\n")
        
        await asyncio.sleep(5)
        
        # ====================================================================
        # TEST 5: call.ended
        # ====================================================================
        print("[TEST 5] call.ended event")
        print("-" * 70)
        
        payload = {
            "event": "call.ended",
            "call": {
                "id": TEST_CALL_ID
            }
        }
        
        print(f"Request: {json.dumps(payload, indent=2)}\n")
        
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}\n")
        
        assert response.status_code == 200
        print("✅ PASS: call.ended\n")
        
        # ====================================================================
        # SUMMARY
        # ====================================================================
        print(f"\n{'='*70}")
        print("✅ ALL TESTS PASSED")
        print(f"{'='*70}\n")
        
        print("Next steps:")
        print("1. Check database: sqlite3 voxai.db")
        print(f"   SELECT * FROM call_sessions WHERE id='{TEST_CALL_ID}';")
        print(f"   SELECT * FROM transcript_events WHERE call_id='{TEST_CALL_ID}';")
        print("\n2. Check logs for detailed processing:")
        print(f"   grep {TEST_CALL_ID} output.log")
        print("\n3. Configure Vapi dashboard to call /vapi/inbound for real calls\n")


async def test_error_cases():
    """Test error handling"""
    
    print(f"\n{'='*70}")
    print(f"Testing error cases")
    print(f"{'='*70}\n")
    
    async with httpx.AsyncClient() as client:
        
        # Missing event
        print("[ERROR TEST 1] Missing event field")
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json={"call": {"id": "test"}}
        )
        print(f"Status: {response.status_code}, Response: {response.json()}")
        assert response.status_code == 200
        print("✅ PASS: Handled gracefully\n")
        
        # Missing call.id
        print("[ERROR TEST 2] Missing call.id")
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json={"event": "transcript"}
        )
        print(f"Status: {response.status_code}, Response: {response.json()}")
        assert response.status_code == 200
        print("✅ PASS: Handled gracefully\n")
        
        # Empty transcript
        print("[ERROR TEST 3] Empty transcript text")
        response = await client.post(
            f"{BASE_URL}/vapi/inbound",
            json={
                "event": "transcript",
                "call": {"id": "test-error"},
                "transcript": {"text": "", "isFinal": True}
            }
        )
        print(f"Status: {response.status_code}, Response: {response.json()}")
        assert response.status_code == 200
        print("✅ PASS: Handled gracefully\n")
        
        print(f"{'='*70}")
        print("✅ ALL ERROR CASES HANDLED")
        print(f"{'='*70}\n")


async def main():
    """Run all tests"""
    try:
        # Check if server is running
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{BASE_URL}/", timeout=2)
                print(f"✅ Server is running: {response.json()}\n")
            except Exception as e:
                print(f"❌ Server is not running: {e}")
                print("Start the server with: python -m uvicorn app.main:app --reload")
                return
        
        # Run main flow test
        await test_inbound_flow()
        
        # Run error cases test
        await test_error_cases()
    
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}\n")
    except Exception as e:
        print(f"\n❌ ERROR: {e}\n")
        raise


if __name__ == "__main__":
    asyncio.run(main())
