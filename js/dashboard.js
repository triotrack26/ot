<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Dashboard - Office OT Register</title>

    <link rel="stylesheet"
          href="css/style.css">

</head>


<body>


<header class="topbar">

    <div>

        <h2>
            Office OT Register
        </h2>

        <span>
            Employee Dashboard
        </span>

    </div>


    <button
        type="button"
        onclick="logout()"
        class="logout-btn">

        Logout

    </button>

</header>



<main class="container">


    <!-- WELCOME -->

    <section class="welcome">

        <p>
            Welcome
        </p>

        <h1 id="employeeName">
            Employee
        </h1>

        <p id="employeeInfo">
            Loading employee details...
        </p>

    </section>



    <!-- TODAY SUMMARY -->

    <section class="cards">


        <div class="card">

            <div class="card-icon">
                ⏱️
            </div>

            <h3>
                Today's OT
            </h3>

            <p>
                <span id="todayOT">
                    0
                </span>
                hrs
            </p>

        </div>



        <div class="card">

            <div class="card-icon">
                🛠️
            </div>

            <h3>
                Today's Extra Duty
            </h3>

            <p>
                <span id="todayExtra">
                    0
                </span>
                hrs
            </p>

        </div>


    </section>



    <!-- QUICK ACTIONS -->

    <div class="section-title">

        <h2>
            Quick Actions
        </h2>

    </div>



    <section class="menu-grid">


        <!-- DAILY OT -->

        <a
            href="daily.html"
            class="menu-card">

            <span>
                ➕
            </span>

            <h3>
                Daily OT Entry
            </h3>

            <p>
                Add today's OT hours,
                extra duty and remarks.
            </p>

        </a>



        <!-- HISTORY -->

        <a
            href="history.html"
            class="menu-card">

            <span>
                📋
            </span>

            <h3>
                OT History
            </h3>

            <p>
                View all your previous
                OT records.
            </p>

        </a>



        <!-- REPORT -->

        <a
            href="report.html"
            class="menu-card">

            <span>
                📊
            </span>

            <h3>
                Monthly Report
            </h3>

            <p>
                View monthly OT report
                and export to Excel.
            </p>

        </a>



        <!-- ADMIN -->

        <a
            href="admin.html"
            class="menu-card">

            <span>
                ⚙️
            </span>

            <h3>
                Admin Module
            </h3>

            <p>
                Manage office hours,
                working days and rules.
            </p>

        </a>


    </section>


</main>



<script src="js/db.js"></script>

<script src="js/auth.js"></script>

<script src="js/dashboard.js"></script>


</body>

</html>
