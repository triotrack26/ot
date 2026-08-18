<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>OT History</title>

    <link rel="stylesheet"
          href="css/style.css">

</head>


<body>


<header class="topbar">

    <div>

        <h2>
            OT History
        </h2>

        <span id="employeeName">
            Employee
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


    <a
        href="dashboard.html"
        class="back-link">

        ← Dashboard

    </a>



    <!-- EMPLOYEE -->

    <div class="welcome">

        <p>
            Employee
        </p>

        <h1 id="employeeNameHistory">
            Loading...
        </h1>

    </div>



    <!-- SUMMARY -->

    <div class="summary-box">


        <h2>
            My OT Summary
        </h2>



        <div class="summary-items">


            <div>

                <span>
                    Total OT
                </span>

                <strong>

                    <span id="historyTotalOT">
                        0
                    </span>

                    hrs

                </strong>

            </div>



            <div>

                <span>
                    Total Extra Duty
                </span>

                <strong>

                    <span id="historyTotalExtra">
                        0
                    </span>

                    hrs

                </strong>

            </div>



            <div>

                <span>
                    Total Records
                </span>

                <strong>

                    <span id="historyTotalRecords">
                        0
                    </span>

                </strong>

            </div>


        </div>


    </div>



    <!-- FILTER -->

    <div class="report-controls">


        <div>

            <label for="historyMonth">

                Select Month

            </label>


            <input
                type="month"
                id="historyMonth"
            >

        </div>



        <button
            type="button"
            onclick="loadHistory()"
            class="secondary-btn">

            🔍 View

        </button>



        <button
            type="button"
            onclick="clearHistoryFilter()"
            class="secondary-btn">

            Show All

        </button>


    </div>



    <!-- HISTORY TABLE -->

    <div class="table-box">


        <h2>
            OT Records
        </h2>



        <div class="table-scroll">


            <table>


                <thead>

                    <tr>

                        <th>
                            Date
                        </th>

                        <th>
                            OT Hours
                        </th>

                        <th>
                            Extra Duty
                        </th>

                        <th>
                            Extra Hours
                        </th>

                        <th>
                            Remarks
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>



                <tbody id="historyTable">

                    <tr>

                        <td
                            colspan="6"
                            style="text-align:center;">

                            Loading records...

                        </td>

                    </tr>

                </tbody>


            </table>


        </div>


    </div>


</main>



<script src="js/db.js"></script>

<script src="js/auth.js"></script>

<script src="js/history.js"></script>


</body>

</html>
