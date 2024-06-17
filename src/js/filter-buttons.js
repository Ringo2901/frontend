const catalogItems = document.querySelectorAll('.catalog-item');
const showHiddenCheckbox = document.querySelector('.catalog-sort_hide-checkbox');
const showAllButton = document.querySelector(".catalog-sort__sort-button.all");
const showFavouriteButton = document.querySelector(".catalog-sort__sort-button.favourite");
const showComparisonButton = document.querySelector(".catalog-sort__sort-button.comparison");

var favouriteItems = [];
var comparisonItems = [];
var hiddenItems = [];

function toggleShowButtons(all, favourite, comparison) {
  showAllButton.classList.remove('active');
  showFavouriteButton.classList.remove('active');
  showComparisonButton.classList.remove('active');

  if (all) {
    showAllButton.classList.toggle('active');
  }
  if (favourite) {
    showFavouriteButton.classList.toggle('active');
  }
  if (comparison) {
    showComparisonButton.classList.toggle('active');
  }
}

function showItemsBasedOnFilter(filter){
    var isHidden = showHiddenCheckbox.checked;
    catalogItems.forEach(function (catalogItem) {
        let shouldDisplay = false;

        if (filter === 'all') {
            shouldDisplay = true;
        } else if (filter === 'favourite' && catalogItem.classList.contains('favourite')) {
            shouldDisplay = true;
        } else if (filter === 'comparison' && catalogItem.classList.contains('comparison')) {
            shouldDisplay = true;
        }
        if (catalogItem.classList.contains('hidden') && !isHidden) {
            shouldDisplay = false;
        }
        
        catalogItem.style.display = shouldDisplay ? 'flex' : 'none';
    });
}



function saveState() {
  localStorage.setItem('favouriteItems', JSON.stringify(favouriteItems.map(item => item.id)));
  localStorage.setItem('comparisonItems', JSON.stringify(comparisonItems.map(item => item.id)));
  localStorage.setItem('hiddenItems', JSON.stringify(hiddenItems.map(item => item.id)));
}

function loadState() {
  const favouriteIds = JSON.parse(localStorage.getItem('favouriteItems')) || [];
  const comparisonIds = JSON.parse(localStorage.getItem('comparisonItems')) || [];
  const hiddenIds = JSON.parse(localStorage.getItem('hiddenItems')) || [];

  favouriteItems = favouriteIds.map(id => document.getElementById(id)).filter(item => item);
  comparisonItems = comparisonIds.map(id => document.getElementById(id)).filter(item => item);
  hiddenItems = hiddenIds.map(id => document.getElementById(id)).filter(item => item);
}

function updateTilesState() {
  loadState();

  favouriteItems.forEach(item => {
    item.classList.add('favourite');
    const favouriteButton = item.querySelector('.catalog-item__hover-button.favourite');
    if (favouriteButton) favouriteButton.classList.add('active');
  });

  comparisonItems.forEach(item => {
    item.classList.add('comparison');
    const comparisonButton = item.querySelector('.catalog-item__hover-button.comparison');
    if (comparisonButton) comparisonButton.classList.add('active');
  });

  hiddenItems.forEach(item => {
    item.classList.add('hidden');
    if (!showHiddenCheckbox.checked) item.style.display = 'none';
    item.style.opacity = '0.5';
    const hideButton = item.querySelector('.catalog-item__hover-button.hide');
    if (hideButton) hideButton.classList.add('active');
  });
}

showHiddenCheckbox.addEventListener('change', function () {
    const activeFilter = document.querySelector('.catalog-sort__sort-button.active').dataset.filter;
    showItemsBasedOnFilter(activeFilter);
});

showAllButton.addEventListener('click', function () {
  toggleShowButtons(true, false, false);
  showItemsBasedOnFilter('all');
});

showComparisonButton.addEventListener('click', function () {
  toggleShowButtons(false, false, true);
  showItemsBasedOnFilter('comparison');
});

showFavouriteButton.addEventListener('click', function () {
  toggleShowButtons(false, true, false);
  showItemsBasedOnFilter('favourite');
});

document.addEventListener('DOMContentLoaded', updateTilesState);

window.addEventListener('beforeunload', saveState);

catalogItems.forEach(function (catalogItem) {
  const hideButton = catalogItem.querySelector('.catalog-item__hover-button.hide');
  const favouriteButton = catalogItem.querySelector('.catalog-item__hover-button.favourite');
  const comparisonButton = catalogItem.querySelector('.catalog-item__hover-button.comparison');


  hideButton.addEventListener('click', function () {
    toggleHide(catalogItem, hideButton);
  });

  favouriteButton.addEventListener('click', function () {
    toggleFavourite(catalogItem, favouriteButton);
  });

  comparisonButton.addEventListener('click', function () {
    toggleComparison(catalogItem, comparisonButton);
  });


  function toggleHide(tile, hideButton) {
    tile.classList.toggle('hidden');

    if (tile.classList.contains('hidden')) {
      if (!showHiddenCheckbox.checked) {
        tile.style.display = 'none';
      }
      tile.style.opacity = '0.5';
      hiddenItems.push(tile);
      hideButton.classList.add('active');
    } else {
      tile.style.opacity = '1';
      hideButton.classList.remove('active');
      hiddenItems.splice(hiddenItems.indexOf(tile), 1);
    }
  }

  function toggleFavourite(tile, button) {
    tile.classList.toggle('favourite');

    if (tile.classList.contains('favourite')) {
      button.classList.add('active');
      favouriteItems.push(tile);
    } else {
      button.classList.remove('active');
      favouriteItems.splice(favouriteItems.indexOf(tile), 1);
    }
  }

  function toggleComparison(tile, button) {
    tile.classList.toggle('comparison');

    if (tile.classList.contains('comparison')) {
      comparisonItems.push(tile);
      button.classList.add('active');
    } else {
      button.classList.remove('active');
      comparisonItems.splice(comparisonItems.indexOf(tile), 1);
    }
  }
});

