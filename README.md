
# 🌍 **Google Map Shield** 🛡

**Google Map Shield** is a **location-based security application** designed to enhance user safety by identifying safe and unsafe paths in real-time. Built using **HTML, CSS, JavaScript, .NET Core, and SQL Server**, this platform is perfect for tourists, travelers, and anyone navigating unfamiliar areas. It provides instant alerts and guidance to ensure safety at all times.

---

## 🚀 **Key Features**

### 🛣 **Safe & Unsafe Path Detection**
- Analyzes routes and marks them as **safe (🟢)** or **unsafe (🔴)** based on crime reports, historical data, and real-time user inputs.
- Highlights unsafe areas on **Google Maps** with warnings and suggests alternative safer routes.

### ⚠ **Real-Time Alerts & Notifications**
- Users receive **instant alerts** if they approach an unsafe location.
- **Push notifications** (via Firebase integration) keep users updated about potential dangers.

### 📍 **Live Location Tracking & Route Planning**
- Tracks user location in **real-time** and provides optimized safe routes.
- Integration with **Google Maps API** enables **turn-by-turn navigation**.

### 📢 **Community-Based Reporting**
- Users can report unsafe locations such as crime-prone areas, accidents, or road hazards.
- Reports are stored in **SQL Server** and used to improve path safety analysis.

### 🔐 **Secure Authentication & User Profiles**
- **ASP.NET Core Identity** ensures secure login and user management.
- Users can save frequent routes and mark personal safe zones.

### 📊 **Admin Dashboard for Data Monitoring**
- Admins can review reported unsafe locations, manage user feedback, and improve route recommendations.
- Generates **statistical insights** on unsafe zones for better decision-making.

---

## 🛠 **Technologies Used**

### ✔ **Frontend**
- **HTML, CSS, JavaScript, Bootstrap**

### ✔ **Backend**
- **.NET Core (ASP.NET MVC)**

### ✔ **Database**
- **SQL Server**

### ✔ **Mapping Services**
- **Google Maps API**

### ✔ **Real-Time Communication**
- **Firebase** for push notifications

### ✔ **Security**
- **ASP.NET Identity** for user authentication

---

## 🚀 **Ideal Use Cases**

### ✅ **Tourists**
- Exploring new cities and needing safe navigation.

### ✅ **Solo Travelers**
- Wanting real-time safety alerts while traveling alone.

### ✅ **Emergency Responders**
- Needing quick access to risk zones during emergencies.

### ✅ **Local Authorities**
- Monitoring and improving public safety in their areas.

---

## 🛡 **Why Google Map Shield?**

The **Google Map Shield** ensures that users can travel safely and confidently, with **real-time updates** and **intelligent path recommendations**. Whether you're a tourist, traveler, or local authority, this platform is your ultimate safety companion.

---

## 🛠 **How to Run the Project**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ZillaChaudhry/Google-Map
   ```

2. **Set Up the Database**
   - Run the SQL Server scripts located in the `Database/` folder.

3. **Configure Firebase**
   - Add your Firebase credentials in the `Firebase/` configuration file.

4. **Run the Backend**
   - Open the `.NET Core` project in Visual Studio and run it.

5. **Launch the Frontend**
   - Open the `index.html` file in your browser.

---
