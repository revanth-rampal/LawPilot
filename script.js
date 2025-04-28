// --- Mobile Sidebar Toggle ---
// Get references to the necessary elements
const sidebar = document.getElementById('sidebar');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const topNavbar = document.getElementById('top-navbar'); // Reference to the top navigation bar

// Add event listener to the mobile menu button (hamburger icon)
mobileMenuToggle.addEventListener('click', () => {
    // Toggle the '-translate-x-full' class to slide the sidebar in and out
    sidebar.classList.toggle('-translate-x-full');
    // Toggle the 'hidden' class on the overlay to show/hide it
    sidebarOverlay.classList.toggle('hidden');
});

// Add event listener to the overlay (dims the background when sidebar is open on mobile)
sidebarOverlay.addEventListener('click', () => {
    // Hide the sidebar and overlay when the overlay is clicked
     sidebar.classList.add('-translate-x-full');
     sidebarOverlay.classList.add('hidden');
});


// --- Sidebar Navigation Logic ---
// Get references to navigation and content elements
const sidebarNav = document.getElementById('sidebar-nav');
const sidebarLinks = sidebarNav.querySelectorAll('.sidebar-link');
const contentContainer = document.getElementById('content-container');
const pageContents = contentContainer.querySelectorAll('.page-content');
const mainHeading = document.getElementById('main-heading'); // Reference to the main H1 tag
let calendarInstance = null; // Variable to hold the FullCalendar instance

// Function to handle navigation and content switching
function navigateToSection(targetId) {
    // Find the content section and sidebar link corresponding to the targetId
    const targetContent = document.getElementById(`content-${targetId}`);
    const targetLink = sidebarNav.querySelector(`.sidebar-link[data-target="${targetId}"]`);

    // Determine the text for the main heading from the clicked link
    // Get the text content, excluding potential SVG icon text if any
    const linkTextElement = targetLink ? targetLink.childNodes[targetLink.childNodes.length -1] : null;
    const linkText = linkTextElement ? linkTextElement.textContent.trim() : 'Dashboard'; // Default to 'Dashboard' if link text not found

    // Update Active Link Styling in the sidebar
    // Remove active styles from all links
    sidebarLinks.forEach(l => l.classList.remove('sidebar-link-active', 'text-white', 'bg-gray-900'));
    // Add active styles to the clicked link (or dashboard link if target not found)
    if (targetLink) {
        targetLink.classList.add('sidebar-link-active', 'text-white', 'bg-gray-900');
    } else {
         // Default to dashboard if target link not found
         sidebarNav.querySelector('.sidebar-link[data-target="dashboard"]').classList.add('sidebar-link-active', 'text-white', 'bg-gray-900');
    }

    // Hide all content sections
    pageContents.forEach(content => content.classList.add('hidden'));

    // Show the target content section
    if (targetContent) {
        targetContent.classList.remove('hidden');
         // Special handling for the calendar section
        if (targetId === 'calendar') {
            initializeCalendar(); // Initialize or update the calendar when its section is shown
        }
    } else {
         // If target content doesn't exist, show the dashboard content by default
         document.getElementById('content-dashboard').classList.remove('hidden');
    }

    // Update the main heading text
    mainHeading.textContent = linkText;

    // Close the sidebar automatically on mobile devices after clicking a link
    if (window.innerWidth < 768 && !sidebar.classList.contains('-translate-x-full')) {
         sidebar.classList.add('-translate-x-full');
         sidebarOverlay.classList.add('hidden');
    }
}

// Add click event listeners to all sidebar links
sidebarLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const targetId = link.getAttribute('data-target'); // Get the target section ID from the data attribute
        navigateToSection(targetId); // Call the navigation function
    });
});

 // Add event listeners to links within dashboard widgets (e.g., "View Calendar ->")
 document.querySelectorAll('.sidebar-link-trigger').forEach(link => {
     link.addEventListener('click', (event) => {
         event.preventDefault(); // Prevent default link behavior
         const targetId = link.getAttribute('data-target'); // Get the target section ID
         navigateToSection(targetId); // Navigate to the corresponding section
     });
 });


// --- FullCalendar Initialization ---
// Function to initialize or update the FullCalendar instance
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar-container'); // Get the calendar container element

    // If the calendar instance already exists, just resize it and return
    if (calendarInstance) {
         calendarInstance.updateSize();
         return;
    }

    // Check if the calendar container exists and the FullCalendar library is loaded
    if (calendarEl && typeof FullCalendar !== 'undefined') {
        // --- Dummy Event Data Generation ---
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Format month (01-12)
        const day = String(today.getDate()).padStart(2, '0');       // Format day (01-31)
        // Calculate next two days (handle month/year changes if necessary - basic example)
        const nextDayDate = new Date(today);
        nextDayDate.setDate(today.getDate() + 1);
        const dayAfterDate = new Date(today);
        dayAfterDate.setDate(today.getDate() + 2);

        const nextDay = String(nextDayDate.getDate()).padStart(2, '0');
        const nextMonth = String(nextDayDate.getMonth() + 1).padStart(2, '0');
        const nextYear = nextDayDate.getFullYear();

        const dayAfter = String(dayAfterDate.getDate()).padStart(2, '0');
        const dayAfterMonth = String(dayAfterDate.getMonth() + 1).padStart(2, '0');
        const dayAfterYear = dayAfterDate.getFullYear();

        const todayStr = `${year}-${month}-${day}`;
        const nextDayStr = `${nextYear}-${nextMonth}-${nextDay}`;
        const dayAfterStr = `${dayAfterYear}-${dayAfterMonth}-${dayAfter}`;
        // --- End Dummy Event Data ---


        // Create a new FullCalendar instance
        calendarInstance = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth', // Default view
            // Configure the header toolbar buttons and title
            headerToolbar: {
                left: 'prev,next today', // Left side: navigation and today button
                center: 'title',          // Center: calendar title (e.g., "April 2025")
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' // Right side: view switcher buttons
            },
            // Add dummy events (replace with actual data fetching later)
            events: [
                { title: 'Client Meeting - Mr. Kumar', start: `${todayStr}T10:00:00`, end: `${todayStr}T11:00:00`, className: 'event-blue' },
                { title: 'File Vakalatnama - Sharma Case', start: nextDayStr, className: 'event-red' }, // All-day event
                { title: 'Court Hearing - Gupta Industries', start: `${dayAfterStr}T14:00:00`, className: 'event-yellow' },
                { title: 'Team Sync', start: `${todayStr}T09:00:00`, end: `${todayStr}T09:30:00`, className: 'event-violet' }
              ],
            editable: true,       // Allow events to be dragged and resized
            selectable: true,       // Allow selecting date ranges
            dayMaxEvents: true,     // Show a "+ more" link when too many events are in a day
            height: 650,            // Set a fixed height for the calendar
            eventDidMount: function(info) {
                // Optional: Add tooltips or custom rendering logic for events after they are mounted
                // Example: tippy(info.el, { content: info.event.title });
            }
        });
        // Render the calendar
        calendarInstance.render();
    } else {
        // Log an error if the container or library is missing
        console.error("Calendar container not found or FullCalendar library not loaded.");
        // Optionally display an error message to the user
        if(calendarEl) { calendarEl.innerHTML = '<p class="text-center text-gray-500">Calendar library failed to load.</p>'; }
    }
}

// Note: The adjustment of top navbar margin based on sidebar state was removed
// because the current layout uses a fixed sidebar on desktop, and the main content
// area scrolls independently under the fixed top navbar.

