 let sidebar = document.querySelector(".sidebar");
    let closeBtn = document.querySelector("#btn");
    let searchBtn = document.querySelector(".bx-search");
    let navList = document.querySelector(".nav-list");

    closeBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      navList.classList.toggle("scroll");
      menuBtnChange(); 
    });


    searchBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      navList.classList.toggle("scroll");
      menuBtnChange(); 
    });

    function menuBtnChange() {
      if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-chevron-left"); 
      } else {
        closeBtn.classList.replace("bx-chevron-left", "bx-menu"); 
      }
    }

