'use strict';
class DatePicker {
    constructor(id, callback) {
        this.id = id;
        this.callback = callback;
    }
    render(date) {
        const months = ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        ];
        const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        const datePicker = document.getElementById(this.id);
        datePicker.innerHTML = "";


        // create all the structures
        const header = document.createElement("div");
        datePicker.appendChild(header);
        

        // header including title, prevbutton, nextbutton
        const monthTitle = document.createElement("div");
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        header.className = "header";
        header.appendChild(prevButton);
        header.appendChild(monthTitle);
        header.appendChild(nextButton);
        
        // set monthTitle
        monthTitle.textContent = months[date.getMonth()] + " " + date.getFullYear();

        // set button
        prevButton.innerHTML= "<";
        prevButton.addEventListener("click", () => {
            date.setMonth(date.getMonth()-1);
            this.render(date);
        });

        nextButton.innerHTML = ">";
        nextButton.addEventListener("click", () => {
            date.setMonth(date.getMonth()+1);
            this.render(date);
        });

        // body including weekdaysRow, daysBody
        const calenderBody = document.createElement("table");
        const weekdaysRow = document.createElement("tr");
        calenderBody.classList = "table";
        calenderBody.appendChild(weekdaysRow);
        datePicker.appendChild(calenderBody);

        // fill weekDaysRow
        for (let i = 0; i < 7; i++) {
            const weekdayElem = document.createElement("td");
            weekdayElem.innerHTML = weekdays[i];
            weekdaysRow.appendChild(weekdayElem);
        }

        // fill up the daysBody
        // get the lastDayIndex of this month and last month

        // daysBody including prevDays, curDays, nextDays
        const firstDayIndex = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        ).getDay();

        const lastDayIndex = new Date(
            date.getFullYear(),
            date.getMonth()+1,
            0
        ).getDay();

        const startDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
        startDay.setDate(startDay.getDate()-firstDayIndex-1);
        endDay.setDate(endDay.getDate()+ 6 - lastDayIndex);
        
        while ((startDay.getMonth() !== endDay.getMonth()) || 
         (startDay.getDate() !== endDay.getDate()) ||
         (startDay.getFullYear() !== endDay.getFullYear())) {
            const tr = calenderBody.insertRow();
            for (let i = 0; i < 7; i++) {
                startDay.setDate(startDay.getDate()+1);
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(startDay.getDate()));
                if (startDay.getMonth() === date.getMonth()) {
                    td.classList = "elem";
                    const fixedDate = {
                        month: startDay.getMonth() + 1, 
                        day: startDay.getDate(), 
                        year: startDay.getFullYear() 
                    };
                    td.addEventListener("click", () => {
                        this.callback(td.id, fixedDate);
                    });
                }
                else {
                    td.classList = "prevNext";
                } 
            }
        }
    }
}