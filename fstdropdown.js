(function(element) {
    element.matches = element.matches || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector;
    element.closest = element.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) return null;
        else return this.parentElement.closest(selector);
    };
}(Element.prototype));
function setFstDropdown() {
    var list = document.querySelectorAll(".fstdropdown-select:not(.fstcreated)");
    for (var sel in list)
        if (list.hasOwnProperty(sel))
            createDropdown(list[sel]);

    function createDropdown(select) {
        var searchDisable = select.dataset["searchdisable"];
        var dropdown = createFstElement("div", "fstdropdown",select.parentNode, { "click": openSelect, "blur": openSelect });
        dropdown.select = select;
        dropdown.setAttribute("tabindex", "0");
        var dropdownPlaceholder = createFstElement("div","fstselected",dropdown,null);
        var selected = select.options[select.selectedIndex];
        dropdownPlaceholder.textContent = selected != undefined ? selected.text : "";
        if (searchDisable == null || searchDisable != "true") {
            var search = createFstElement("div", "fstsearch",dropdown, null);
            createFstElement("input", "fstsearchinput", search,{"keyup": getSearch,"paste": getSearch,"blur": openSelect});
        }
        createFstElement("div","fstlist",dropdown,null);
        select.fstdropdown = {
            dd: dropdown,
            rebind: function () { rebindDropdown(select); }
        };
        rebindDropdown(select);
        select.classList.add("fstcreated");
    }

    function openSelect(event, open) {
        var select = event.target.classList.contains("fstdropdown") ? event.target.select : event.target.closest(".fstdropdown").select;
        open = open == null ? event.type != "blur" : open;
        var el = select.fstdropdown.dd;
        if (event.relatedTarget != null && event.relatedTarget.tagName == "INPUT" 
            || event.target.tagName == "INPUT" && event.type != "blur" 
            || event.target.tagName == "INPUT" && (event.relatedTarget != null && event.relatedTarget.className == "fstdropdown open") 
            || event.target.classList.contains("fstselected") && event.type == "blur" && document.activeElement.classList.contains("fstsearchinput")
            || event.type == "blur" && document.activeElement.className == "fstlist") return;
        if (!open || el.classList.contains("open")) {
            el.classList.remove("open");
            return;
        }
        el.classList.add("open");
        var selected = select.value;
        var hover = selected != null ? el.querySelector("[data-value='" + selected + "']") : el.querySelector(".fstlist").firstChild;
        initNewEvent("mouseover", hover,false);
    }

    function changeSelect(event) {
        var select = event.target.closest(".fstdropdown").select;
        var dd = select.fstdropdown.dd;
        dd.querySelector(".fstselected").textContent = event.target.dataset["text"];
        if (select.value != event.target.dataset["value"]) {
            select.value = event.target.dataset["value"];
            initNewEvent("change", select);
        }
        openSelect(event,false);
    }

    function rebindDropdown(select) {
        var search = select.fstdropdown.dd.querySelector(".fstsearchinput");
        if(search!=null)
            search.value = "";
        var optList = select.querySelectorAll("option");
        var ddList = select.fstdropdown.dd.querySelector(".fstlist");
        while (ddList.lastChild)
            ddList.removeChild(ddList.lastChild);
        for (var opt in optList) {
            if (optList.hasOwnProperty(opt)) {
                var listEl = document.createElement("div");
                listEl.textContent = optList[opt].text;
                listEl.dataset["value"] = optList[opt].value;
                listEl.dataset["text"] = optList[opt].text;
                listEl.addEventListener("click",changeSelect);
                listEl.addEventListener("mouseover",
                    function(event) {
                        var hovered = ddList.querySelector(".hover");
                        if (hovered != null)
                            hovered.classList.remove("hover");
                        event.target.classList.add("hover");
                    });
                ddList.appendChild(listEl);
            }
        }
        if (ddList.firstChild != null)
            select.fstdropdown.dd.querySelector(".fstselected").textContent = ddList.firstChild.textContent;
    }

    function initNewEvent(eventName, target) {
        var event;
        if (typeof (Event) === "function")
            event = new Event(eventName, { bubbles: true });
        else {
            event = document.createEvent("Event");
            event.initEvent(eventName, true, true);
        }
        target.dispatchEvent(event);
    }

    function getSearch(event) {
        var pasteText = event.type !="paste" ? "" : typeof event.clipboardData === "undefined" ?
            window.clipboardData.getData("Text") : event.clipboardData.getData("text/plain");
        var val = event.type != "paste" ? event.target.value : pasteText;
        var dd = event.target.closest(".fstdropdown");
        var ddList = dd.querySelectorAll(".fstlist>div");
        var highlightSet = false;
        var hovered = dd.querySelector(".hover");
        if (hovered != null)
            hovered.classList.remove("hover");
        for (var div in ddList) {
            if (ddList.hasOwnProperty(div))
                if (ddList[div].textContent.toLowerCase().indexOf(val.toLowerCase()) != -1) {
                    ddList[div].classList.remove("hideFst");
                    if (!highlightSet)
                        ddList[div].classList.add("hover");
                    highlightSet = true;
                } else
                    ddList[div].classList.add("hideFst");
        }
    }

    function createFstElement(type,className,parent,eventListener) {
        var element = document.createElement(type);
        if(className!=null)
            element.classList.add(className);
        if (eventListener != null)
            for (var ev in eventListener)
                if (eventListener.hasOwnProperty(ev))
                    element.addEventListener(ev, eventListener[ev], true);
        parent.appendChild(element);
        return element;
    }
}

document.addEventListener("DOMContentLoaded", setFstDropdown);
