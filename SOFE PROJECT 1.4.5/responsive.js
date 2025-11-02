// Responsive mobile menu functionality

function toggleMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const body = document.body;
  
  if (sidebar) {
    const isOpen = sidebar.classList.contains('mobile-open');
    sidebar.classList.toggle('mobile-open');
    body.classList.toggle('sidebar-open');
    
    // Ensure overlay state matches sidebar state
    if (overlay) {
      if (!isOpen) {
        overlay.classList.add('active');
      } else {
        overlay.classList.remove('active');
      }
    }
  }
}

function closeMobileMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const body = document.body;
  
  if (sidebar) {
    sidebar.classList.remove('mobile-open');
  }
  
  // Remove body class to restore scrolling
  body.classList.remove('sidebar-open');
  
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Close menu when clicking overlay
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.querySelector('.sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking a nav item on mobile
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Add data labels to table cells for mobile display
  function addTableLabels() {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
      const headers = table.querySelectorAll('thead th');
      const rows = table.querySelectorAll('tbody tr');
      
      headers.forEach((header, index) => {
        const label = header.textContent.trim();
        rows.forEach(row => {
          const cell = row.querySelectorAll('td')[index];
          if (cell) {
            cell.setAttribute('data-label', label);
          }
        });
      });
    });
  }

  // Run on load and when tables are updated
  addTableLabels();
  
  // Re-run when tables are dynamically updated
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        addTableLabels();
      }
    });
  });

  const tableBodies = document.querySelectorAll('.data-table tbody');
  tableBodies.forEach(tbody => {
    observer.observe(tbody, { childList: true });
  });
});

// Handle window resize
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

