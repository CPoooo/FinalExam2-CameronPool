import unittest
import requests
import json

class TestConeApp(unittest.TestCase):
    def test_add_cone(self):
        cone_data = {"radius": 5, "height": 10, "slantHeight": 12}
        r = requests.post("http://localhost:3000/addCone", json=cone_data)
        data = r.json()
        self.assertEqual(r.status_code, 201)  # Assuming 201 is the status code for successful cone addition
        self.assertIn("coneID", data)  # Check if coneID is present in the response

    def test_update_cone(self):
        cone_id = "your-cone-id"
        updated_cone_data = {"radius": 6, "height": 12, "slantHeight": 14}
        r = requests.put(f"http://localhost:3000/updateCone/{cone_id}", json=updated_cone_data)
        self.assertEqual(r.status_code, 200)  # successful cone update

    def test_display_all_cones(self):
        r = requests.get("http://localhost:3000/getAllCones")
        data = r.json()
        self.assertEqual(r.status_code, 200)  # successful request to display all cones
        self.assertIsInstance(data, list)  # Check if response data is a list

if __name__ == '__main__':
    unittest.main()
