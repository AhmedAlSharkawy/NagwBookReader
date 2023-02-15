var xmlhttp = new XMLHttpRequest();
var btns = [];
var currentPageIndex = 0;
var bookContainerClass = "bookContainer";
var bookContainer = document.getElementById(bookContainerClass);
var prevNavigationBtn = ".navigation__btn_prev";
var nextNavigationBtn = ".navigation__btn_next";
var settingMenu = "#settingMenu";
var fontFamilySettingMenu = "#fontFamilySettingMenu";
var userScreenSize = bookContainer.clientHeight;
var scrollLimit = 0;
var defaultBookFontSize = 18;
var bookFontSize = defaultBookFontSize;
var minFontSize = (defaultBookFontSize * 70) / 100;
var maxFontSize = (defaultBookFontSize * 130) / 100;
var fontSizeVariant = (defaultBookFontSize * 15) / 100;
var updateFontVar = fontSizeVariant;

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    loadNav(this);
  }
};

xmlhttp.open("GET", "packages/26dd5f00-0c75-4367-adea-537ece731385/Navigation/nav.xhtml", true);
xmlhttp.send();
    
function loadNav(xml){
    var i;
    var xmlDoc = xml.responseXML;
    var list = xmlDoc.getElementsByTagName("ol")[0];
    var items = list.getElementsByTagName("li");

    for(i=0 ; i<items.length; i++){
      var pageUrl = items[i].getElementsByTagName("a")[0].getAttribute("href");
    
      btns.push({
        index: i,
        url: pageUrl
      });
      
    }
  }

function loadXMLDoc(page) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      loadBook(this);
    }
  };
  xmlhttp.open("GET", "packages/26dd5f00-0c75-4367-adea-537ece731385/Content/" + page, true);
  xmlhttp.send();
  localStorage.setItem('currentChapter', currentPageIndex);
  drawCurrentNavigationCount();
}

function loadBook(xml) {
  var xmlDoc = xml.responseXML;
  var content = xmlDoc.getElementsByTagName("body")[0].innerHTML;

  document.getElementById("bookPage").innerHTML = content;
}

function getLocalPage() {
  return Number(localStorage.getItem('currentChapter')) || 0;
}

function loadFirstPage(pageIndex) {
  var firstPageUrl = btns[pageIndex].url;

  loadXMLDoc(firstPageUrl.split("/").pop());
  drawNavigation();
}

function loadNextPage() {
  enableNavigation(prevNavigationBtn);

  if(isTheSameChapter(bookContainer)) {
      loadChapterNextSection();

      return;
  }

  loadNextChapter();
}

function loadPrevPage () {
  enableNavigation(nextNavigationBtn);

  if(scrollLimit > 0) {
      loadChapterPrevSection();

      return;
  }

  loadPrevChapter();
}

function loadNextChapter() {
  if(isLastPage()) {
    disableNavigation(nextNavigationBtn);

    return;
  }

  enableNavigation(nextNavigationBtn);
  enableNavigation(prevNavigationBtn);
  startChapter();
  currentPageIndex ++;

  var pageUrl = btns[currentPageIndex].url;

  loadXMLDoc(pageUrl.split("/").pop());
}

function loadPrevChapter () {
  if(isFirstPage()) {
    disableNavigation(prevNavigationBtn);

    return;
  }

  enableNavigation(prevNavigationBtn);
  enableNavigation(nextNavigationBtn);
  startChapter();
  currentPageIndex --;

  var pageUrl = btns[currentPageIndex].url;
  
  loadXMLDoc(pageUrl.split("/").pop());
}

function isFirstPage() {
  return currentPageIndex <= 0;
}

function isLastPage() {
  return currentPageIndex >= btns.length - 1;
}

function drawNavigation() {
  if(isFirstPage()) {
    disableNavigation(prevNavigationBtn);
  } else if(isLastPage()) {
    disableNavigation(nextNavigationBtn);
  } else {
    enableNavigation(prevNavigationBtn);
    enableNavigation(nextNavigationBtn);
  }

  drawNavigationCount();
} 

function drawNavigationCount() {
  drawCurrentNavigationCount();
  $('.navigation__count__book').html(btns.length);
}

function drawCurrentNavigationCount() {
  var pageCount = currentPageIndex + 1;

  $('.navigation__count__current').html(pageCount)
}

function disableNavigation(navigator) {
  $(navigator).attr("disabled", true);
}

function enableNavigation(navigator) {
  $(navigator).attr("disabled", false);
}

function isTheSameChapter(element) {
  var scrollHeight = element.scrollHeight;
  var scrollTop = element.scrollTop;
  var clientHeight = element.clientHeight;
  var isScrollWithinViewPort = Math.abs(scrollHeight - clientHeight - scrollTop) >= 1;

  return isScrollWithinViewPort;
}

function loadChapterNextSection() {
  scrollLimit += userScreenSize;
  bookContainer.scroll(0, scrollLimit);
}

function loadChapterPrevSection() {
  scrollLimit -= userScreenSize;
  bookContainer.scroll(0, scrollLimit);
}

function startChapter() {
  scrollLimit = 0;
  bookContainer.scroll(0, scrollLimit);
}

function toggleSetting() {
  $(settingMenu).toggle();
}

// Change color mood
function changeBodyColorMood(colorMood) {
  $('body').attr('colormood', colorMood);
}

$('input[type=radio][name=colorMood]').change(function() {
  if (this.value == 'dark') {
    changeBodyColorMood('dark');
  } else if (this.value == 'pink') {
    changeBodyColorMood('pink');
  } else {
    changeBodyColorMood('default');
  }
});

// Change font size
function changeFontSize(fontSize) {
  $('.setting__font-size-btn').attr("disabled", false);
  switch (fontSize) {
    case "bigger":
      if(bookFontSize >= maxFontSize) {
        $('#fontSizeBigger').attr("disabled", true);
    
        break;
      }

      incrementFontSize();
      break;
    case "smaller":
      if (bookFontSize.toFixed(1) <= minFontSize) {
        $('#fontSizeSmaller').attr("disabled", true);
    
        break;
      }

      decrementFontSize();
      break;
    default:
      break;
  }
}

function updateFontSize(size) {
  var fontSizePercentage = Math.round((size / defaultBookFontSize) * 100) + '%';

  $('#' + bookContainerClass).css('font-size', size);
  $('#fontSizeSmallerPercentage').html(fontSizePercentage);
}

function incrementFontSize() {
  bookFontSize += fontSizeVariant;
  updateFontSize(bookFontSize);
}

function decrementFontSize() {
  bookFontSize -= fontSizeVariant;  
  updateFontSize(bookFontSize);
}

// Change font family
function toggleFontFamilySetting() {
  $(settingMenu).toggle();
  $(fontFamilySettingMenu).toggle();
}

$('input[type=radio][name=fontFamily]').change(function() {
  if (this.value == 'noto') {
    updateFontFamily('NotoNaskhArabic');
    updateFontFamilyTitle('Noto Naskh Arabic');
  } else if (this.value == 'tahoma') {
    updateFontFamily('tahoma');
    updateFontFamilyTitle('Tahoma');
  } else {
    updateFontFamily('arial');
    updateFontFamilyTitle('Arial');
  }
});

function updateFontFamily(family) {
  $('.setting__font-family-title').html(family);
}

function updateFontFamilyTitle(family) {
  $('#' + bookContainerClass).css('font-family', family);
}

///////////////////////////////////////////////////////////
$(".book-container").click(function () {
  $("#taskRunnerNav").slideToggle();
  $(settingMenu).hide();
  $(fontFamilySettingMenu).hide();
});

$(document).ready(function() {
  currentPageIndex = getLocalPage();
  setTimeout(loadFirstPage(currentPageIndex), 100);
});
