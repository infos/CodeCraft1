document.addEventListener('DOMContentLoaded', function () {
  // Select all filter links
  const filters = document.querySelectorAll('.filter');

  filters.forEach(filter => {
    filter.addEventListener('click', function(e) {
      e.preventDefault();
      // Remove 'active' from all filters and add to current filter
      filters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');
      filterTours(filterValue);
    });
  });

  function filterTours(filterValue) {
    const tours = document.querySelectorAll('.tour-item');
    tours.forEach(tour => {
      // Show tour if filter is "all" or if tour matches filter
      if (filterValue === 'all' || tour.getAttribute('data-era') === filterValue) {
        tour.style.display = 'block';
      } else {
        tour.style.display = 'none';
      }
    });
  }

  // Sample tour data updated with Medieval Europe
  const toursSection = document.getElementById('tours');
  const sampleTours = [
    { id: 1, title: 'Mesopotamian Marvels Tour', era: 'ancient-near-eastern' },
    { id: 2, title: 'Egyptian Pharaohs and Temples', era: 'ancient-egypt' },
    { id: 3, title: 'Greek Myths and Legends Tour', era: 'ancient-greece' },
    { id: 4, title: 'The Rise of Rome', era: 'ancient-rome' },
    { id: 5, title: 'Byzantine Legacy Tours', era: 'byzantine' },
    { id: 6, title: 'Medieval Castles and Kings', era: 'medieval-europe' }
  ];

  // Render sample tour items
  sampleTours.forEach(tour => {
    const tourDiv = document.createElement('div');
    tourDiv.className = 'tour-item';
    tourDiv.setAttribute('data-era', tour.era);
    tourDiv.innerHTML = `<h2>${tour.title}</h2>
                         <p>Discover the rich heritage of ${tour.title.split(' ')[0]} history on this exclusive tour.</p>`;
    toursSection.appendChild(tourDiv);
  });
});