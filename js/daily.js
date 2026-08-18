<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Daily OT Entry</title>

    <link rel="stylesheet"
          href="css/style.css">

</head>


<body>


<header class="topbar">

    <div>

        <h2>
            Daily OT Entry
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



    <!-- ENTRY FORM -->

    <div class="form-box wide">


        <h1>
            Daily OT Entry
        </h1>


        <p class="subtitle">

            Enter your overtime and
            extra duty details for the day.

        </p>



        <form id="dailyForm">


            <!-- DATE -->

            <label for="date">

                Date *

            </label>


            <input
                type="date"
                id="date"
                required
            >



            <!-- OT HOURS -->

            <label for="otHours">

                OT Hours

            </label>


            <input
                type="number"
                id="otHours"
                min="0"
                step="0.5"
                placeholder="Example: 2"
            >



            <!-- EXTRA DUTY -->

            <label for="extraDuty">

                Extra Duty

            </label>


            <input
                type="text"
                id="extraDuty"
                placeholder="Example: Laptop Maintenance"
            >



            <!-- EXTRA DUTY HOURS -->

            <label for="extraHours">

                Extra Duty Hours

            </label>


            <input
                type="number"
                id="extraHours"
                min="0"
                step="0.5"
                placeholder="Example: 1.5"
            >



            <!-- REMARKS -->

            <label for="remarks">

                Remarks

            </label>


            <textarea
                id="remarks"
                rows="4"
                placeholder="Enter additional details..."
            ></textarea>



            <!-- SAVE -->

            <button
                type="submit"
                class="primary-btn">

                💾 Save Daily Record

            </button>


        </form>


    </div>



    <!-- DAILY SUMMARY -->

    <div class="summary-box">


        <h2>
            Selected Date Summary
        </h2>


        <div class="summary-items">


            <div>

                <span>
                    Total OT
                </span>

                <strong>

                    <span id="totalOT">
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

                    <span id="totalExtra">
                        0
                    </span>

                    hrs

                </strong>

            </div>


        </div>


    </div>



    <!-- RECORD TABLE -->

    <div class="table-box">


        <h2>
            Records for Selected Date
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



                <tbody id="dailyTable">

                    <tr>

                        <td
                            colspan="6"
                            style="text-align:center;">

                            No records found.

                        </td>

                    </tr>

                </tbody>


            </table>


        </div>


    </div>


</main>



<script src="js/db.js"></script>

<script src="js/auth.js"></script>

<script src="js/daily.js"></script>


</body>

</html>
