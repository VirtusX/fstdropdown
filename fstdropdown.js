function setFstDropdown() {
    var list = document.querySelectorAll(".fstdropdown-select:not(.fstcreated)");
    for (var i = 0; i < list.length; i++)
        createDropdown(list[i]);

    function createDropdown(select) {
        var searchDisable = select.dataset["searchdisable"];
        var dropdown = document.createElement("div");
        dropdown.classList.add("fstdropdown");
        dropdown.setAttribute("tabindex", "0");
        var dropdownPlaceholder = document.createElement("div");
        dropdownPlaceholder.classList.add("fstselected");
        var selected = select.options[select.selectedIndex];
        dropdownPlaceholder.textContent = selected != undefined ? selected.text : "";
        dropdown.appendChild(dropdownPlaceholder);
        if (searchDisable == null || searchDisable != "true") {
            var search = document.createElement("div");
            var searchInput = document.createElement("input");
            search.classList.add("fstsearch");
            searchInput.classList.add("fstsearchinput");
            searchInput.addEventListener("keyup", function (event) {getSearch(event,select)});
            search.appendChild(searchInput);
            dropdown.appendChild(search);
            searchInput.addEventListener("blur", function(event) {openSelect(event, select, false);}, true);
        }
        var dropdownList = document.createElement("div");
        dropdownList.classList.add("fstlist");
        dropdown.appendChild(dropdownList);
        select.parentNode.appendChild(dropdown);
        dropdown.addEventListener("click", function (event) { openSelect(event, select, true); }, true);    
        dropdown.addEventListener("blur", function (event) { openSelect(event, select, false); }, true);
        select.fstdropdown = {
            dd: dropdown,
            rebind: function () { rebindDropdown(select); }
        };
        rebindDropdown(select);
        select.classList.add("fstcreated");
    }

    function openSelect(event, select, open) {
        var el = select.fstdropdown.dd;
        if (event.relatedTarget != null && event.relatedTarget.tagName == "INPUT" 
            || event.target.tagName == "INPUT" && event.type != "blur" 
            || event.target.tagName == "INPUT" && (event.relatedTarget != null && event.relatedTarget.className == "fstdropdown open") 
            || event.target.className == "fstselected" && event.type == "blur" && document.activeElement.classList.contains("fstsearchinput")
            || event.type == "blur" && document.activeElement.className == "fstlist") {
            return;
        }
        if (!open || el.classList.contains("open")) {
            el.classList.remove("open");
            return;
        }
        el.classList.add("open");
        var selected = select.value;
        var hover;
        if (selected != null)
            hover = el.querySelector("[data-value='" + selected + "']");
        else
            hover = el.querySelector(".fstlist").firstChild;
        createNewEvent("mouseover", hover);
    }

    function changeSelect(event, el, select) {
        var dd = select.fstdropdown.dd;
        dd.querySelector(".fstselected").textContent = el.dataset["text"];
        if (select.value != el.dataset["value"]) {
            select.value = el.dataset["value"];
            createNewEvent("change", select);
        }
        openSelect(event, select, false);
    }

    function rebindDropdown(el) {
        var search = el.fstdropdown.dd.querySelector(".fstsearchinput");
        if(search!=null)
            search.value = "";
        var optList = el.querySelectorAll("option");
        var ddList = el.fstdropdown.dd.querySelector(".fstlist");
        while (ddList.lastChild)
            ddList.removeChild(ddList.lastChild);
        for (var opt = 0; opt < optList.length; opt++) {
            var listEl = document.createElement("div");
            listEl.textContent = optList[opt].text;
            listEl.dataset["value"] = optList[opt].value;
            listEl.dataset["text"] = optList[opt].text;
            listEl.addEventListener("click", function (event) {
                changeSelect(event, event.target, el);
            });
            listEl.addEventListener("mouseover", function (event) {
                var hovered = ddList.querySelector(".hover");
                if (hovered != null)
                    hovered.classList.remove("hover");
                event.target.classList.add("hover");
            });
            ddList.appendChild(listEl);
        }
        if (ddList.firstChild != null)
            el.fstdropdown.dd.querySelector(".fstselected").textContent = ddList.firstChild.textContent;
    }

    function createNewEvent(eventName, target) {
        var event;
        if (typeof (Event) === "function")
            event = new Event(eventName, { bubbles: true });
        else {
            event = document.createEvent("Event");
            event.initEvent(eventName, true, true);
        }
        target.dispatchEvent(event);
    }

    function getSearch(event, select) {
        var val = event.target.value;
        var dd = select.fstdropdown.dd;
        var ddList = dd.querySelectorAll(".fstlist>div");
        var highlightSet = false;
        var hovered = dd.querySelector(".hover");
        if (hovered != null)
            hovered.classList.remove("hover");
        for (var j = 0; j < ddList.length; j++) {
            if (ddList[j].textContent.toLowerCase().indexOf(val.toLowerCase()) != -1) {
                ddList[j].classList.remove("hideFst");
                if(!highlightSet)
                    ddList[j].classList.add("hover");
                highlightSet = true;
            }
            else
                ddList[j].classList.add("hideFst");
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setFstDropdown();
});