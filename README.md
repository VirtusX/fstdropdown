# fstdropdown
fstdropdown - simple quick javascript dropdown plugin with bootstrap design and search, that able to work with thousands of options. Now with multiselect too.
It has no dependencies, pure js and css.


# USAGE
fstdropdown initializes on page load, just add class "fstdropdown-select" to your select. 
If you add your select dynamically, add "fstdropdown-select" class to it and call function setFstDropdown().
If you change your select options list, use document.querySelector("your select").fstdropdown.rebind() to update dropdown list.
You can use multiselect, by adding attribute multiple="multiple" to select.
If you dont need search in dropdown, just add data-searchdisable="true" to the select. 
To add placeholder to search input, add data-placeholder to select.
To use opened select or multiselect, add data-opened="true" to select.

Demo - https://htmlpreview.github.io/?https://github.com/VirtusX/fstdropdown/blob/master/index.html
