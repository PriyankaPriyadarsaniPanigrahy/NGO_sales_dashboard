document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const rowsPerPage = 10;
    let salesData = [];

    fetch("output.json") // Load JSON file
        .then(response => response.json())
        .then(data => {
            salesData = data;
            populateFilters(salesData);
            loadTable(salesData, currentPage);
            generateChart(salesData);
        })
        .catch(error => console.error("Error loading data:", error));

    function populateFilters(data) {
        let categoryFilter = document.getElementById("categoryFilter");
        let locationFilter = document.getElementById("locationFilter");

        categoryFilter.innerHTML = '<option value="">📌 All Categories</option>';
        locationFilter.innerHTML = '<option value="">📌 All Locations</option>';

        let categories = [...new Set(data.map(row => row.Category))].filter(Boolean);
        let locations = [...new Set(data.map(row => row.Location))].filter(Boolean);

        categories.forEach(category => {
            let option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        locations.forEach(location => {
            let option = document.createElement("option");
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });

        console.log("✅ Filters populated:", categories, locations);
    }

    function loadTable(data, page) {
        let tableBody = document.getElementById("salesData");
        let tableHead = document.getElementById("tableHeader");
        tableBody.innerHTML = "";
        tableHead.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='8' class='text-center'>❌ No results found</td></tr>";
            return;
        }

        let headers = ["Product_ID", "Product_Name", "Category", "Unit_Cost_USD", "Selling_Price_USD", "Quantity_Sold", "Total_Revenue_USD", "Location"];
        headers.forEach(header => {
            let th = document.createElement("th");
            th.textContent = header.replace(/_/g, " ");
            th.classList.add("sortable");
            th.onclick = () => sortTable(header);
            tableHead.appendChild(th);
        });

        let start = (page - 1) * rowsPerPage;
        let end = start + rowsPerPage;
        let paginatedData = data.slice(start, end);

        paginatedData.forEach(row => {
            let tr = document.createElement("tr");
            headers.forEach(header => {
                let td = document.createElement("td");
                td.textContent = row[header];
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        updatePagination(data.length, page);
    }

    function updatePagination(totalRows, page) {
        let totalPages = Math.ceil(totalRows / rowsPerPage);
        document.getElementById("pageInfo").textContent = `Page ${page} of ${totalPages}`;
        document.getElementById("prevPage").disabled = page === 1;
        document.getElementById("nextPage").disabled = page === totalPages;
    }

    function sortTable(column) {
        salesData.sort((a, b) => (a[column] > b[column] ? 1 : -1));
        loadTable(salesData, currentPage);
    }

    function filterData() {
        let searchValue = document.getElementById("searchInput").value.toLowerCase();
        let categoryValue = document.getElementById("categoryFilter").value;
        let locationValue = document.getElementById("locationFilter").value;

        let filteredData = salesData.filter(row =>
            (row.Product_Name.toLowerCase().includes(searchValue) || row.Category.toLowerCase().includes(searchValue)) &&
            (categoryValue === "" || row.Category === categoryValue) &&
            (locationValue === "" || row.Location === locationValue)
        );

        loadTable(filteredData, 1);
        generateChart(filteredData);
    }

    function generateChart(data) {
        let productNames = data.map(row => row.Product_Name);
        let revenues = data.map(row => row.Total_Revenue_USD);

        let ctx = document.getElementById("salesChart").getContext("2d");

        if (window.salesChartInstance) {
            window.salesChartInstance.destroy();
        }

        window.salesChartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: productNames,
                datasets: [{
                    label: "Total Revenue ($)",
                    data: revenues,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    document.getElementById("searchInput").addEventListener("input", filterData);
    document.getElementById("categoryFilter").addEventListener("change", filterData);
    document.getElementById("locationFilter").addEventListener("change", filterData);
    document.getElementById("resetFilters").addEventListener("click", () => {
        document.getElementById("searchInput").value = "";
        document.getElementById("categoryFilter").value = "";
        document.getElementById("locationFilter").value = "";
        filterData();
    });

    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadTable(salesData, currentPage);
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage * rowsPerPage < salesData.length) {
            currentPage++;
            loadTable(salesData, currentPage);
        }
    });
});
