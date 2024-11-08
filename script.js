document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("table tbody");
    const dateFilter = document.getElementById("dateFilter");
    const venueFilter = document.getElementById("venueFilter");

    // Function to populate the table
    function populateTable(data) {
        tableBody.innerHTML = ""; // Clear existing rows
        data.forEach(row => {
            const tr = document.createElement("tr");
            Object.values(row).forEach(cellValue => {
                const td = document.createElement("td");
                td.textContent = cellValue;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // Load CSV and parse with PapaParse
    fetch("event_table.csv")
        .then(response => response.text())
        .then(csvData => {
            const parsedData = Papa.parse(csvData, {
                header: true,  // Assumes first row contains headers
                skipEmptyLines: true,
            });
            populateTable(parsedData.data); // Populate the table with parsed data
            setupFilters(parsedData.data);  // Populate the filters
        })
        .catch(error => console.error("Error loading CSV:", error));

    // Set up filters with unique values from CSV data
    function setupFilters(data) {
        const dates = new Set();
        const venues = new Set();

        data.forEach(row => {
            dates.add(row.Date);
            venues.add(row.Venue);
        });

        dates.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = date;
            dateFilter.appendChild(option);
        });

        venues.forEach(venue => {
            const option = document.createElement("option");
            option.value = venue;
            option.textContent = venue;
            venueFilter.appendChild(option);
        });

        // Attach event listeners to filter dropdowns
        dateFilter.addEventListener("change", () => filterTable(data));
        venueFilter.addEventListener("change", () => filterTable(data));
    }

    // Filter table based on selected filters
    function filterTable(data) {
        const selectedDate = dateFilter.value;
        const selectedVenue = venueFilter.value;

        const filteredData = data.filter(row => {
            const dateMatch = !selectedDate || row.Date === selectedDate;
            const venueMatch = !selectedVenue || row.Venue === selectedVenue;
            return dateMatch && venueMatch;
        });

        populateTable(filteredData);
    }
});
