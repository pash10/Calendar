document.addEventListener("DOMContentLoaded", function () {
    let path = window.location.pathname;
    let page = path.split("/").pop();

    // If page is an empty string, assume it's the home page ('index.html')
    if (page === "") {
        page = "index.html";
    }

    console.log("Page from URL: ", page);

    let navItems = document.querySelectorAll("#navbar a");

    // Add 'active-nav-item' class to the current page nav item or home if href is ""
    navItems.forEach(item => {
        if (item.getAttribute("href").includes(page) || (item.getAttribute("href") === "" && page === "index.html")) {
            item.classList.add('active-nav-item');
        } else {
            item.classList.remove('active-nav-item');
        }
    });

    // Function to update the display of navigation links
    function updateNavDisplay() {
        const isLoggedIn = localStorage.getItem('login') === "true";
        const isAdmin = localStorage.getItem("admin") === "1";
        
    console.log('isLoggedIn:', isLoggedIn);
    console.log('isAdmin:', isAdmin);

        // Define the display states for each link element
        const displayStates = {
            homeLink: true, // Always visible
            loginLink: !isLoggedIn,
            registerLink: !isLoggedIn,
            QuerisButton: isLoggedIn,
            logoutButton: isLoggedIn,
        };

        // Loop through the displayStates and set the display property of the parent <li>
        Object.keys(displayStates).forEach((linkId) => {
            const linkElement = document.getElementById(linkId);
            if (linkElement) {
                const listItem = linkElement.parentElement; // Get the parent <li> element
                console.log(`Setting display for ${linkId}: ${displayStates[linkId]}`);
                listItem.style.display = displayStates[linkId] ? 'block' : 'none';
                
            }
        });
    }

    // Call the function to set the initial display states for nav items
    updateNavDisplay();
});