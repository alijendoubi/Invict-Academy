# Postman API Testing Guide

I have successfully generated a complete Postman collection containing **every single protected and public API endpoint** inside the backend.

## 🛠️ Step 1: Import the Collection
1. Open **Postman**.
2. Click **Import** (top left corner).
3. Select the file: `d:\Invict Academy\Invict-Academy\Invict-Academy-API.postman_collection.json`
4. You will now see the `Invict Academy API` collection imported with 10 structured folders.

---

## 🔑 Step 2: Authentication (Important!)
Your API relies on **HTTP-only Cookies** for authentication (`session`), not Bearer tokens.

Fortunately, Postman automatically captures and manages cookies for you! Here is the workflow:

1. Open the **1. Auth & Profiles** folder.
2. Open the **Login (Starts Session)** request.
3. Switch to the **Body** tab and enter a valid email and password for the role you want to test (e.g., `SUPER_ADMIN`, `STAFF`, or `STUDENT`). 
   *Note: Next.js reads `FormData`, so the body is submitted as `form-data` with `email` and `password` keys.*
4. Click **Send**.
5. If successful (you receive a 200 OK), Postman will **automatically save the `session` cookie** to its internal cookie jar for `localhost`.
6. From now on, you can execute **any other protected API request** in the collection, and Postman will seamlessly attach the session cookie in the background.

*To change roles (e.g., to test what a Student sees), execute the **Logout** request, then **Login** again using a student account.*

---

## 🌍 Next.js Dynamic Variables
If you need to test the API on a live staging environment instead of `localhost:3000`:
1. Click on the Collection name (`Invict Academy API`).
2. Go to the **Variables** tab.
3. Change the `base_url` variable from `http://localhost:3000` to your deployed URL (e.g., `https://api.invictacademy.com`).
4. Click **Save**.

---

## 📝 Tips for Testing Specific Data
- **Dynamic IDs**: Many routes utilize dynamic parameters like `/api/students/123`. I have pre-filled these endpoints with `123`. Make sure you replace `123` with a legitimate database UUID from your database before hitting **Send**.
- **File Uploads**: For `/api/documents/upload`, go to the **Body** tab, ensure `form-data` is selected, and change the input type of the `file` field from `Text` to `File`, then attach a sample PDF.
- **Data Boundaries**: When testing as a Student, trying to access `/api/users` or `/api/leads` will accurately return `403 Forbidden` according to the policies we just secured. Ensure you are testing with the appropriate role login active!
