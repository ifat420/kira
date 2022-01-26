let sidebar = document.querySelector('.drawer');
let menubutton = document.querySelector('.menu-m');
let closebutton = document.querySelector('.menu-close');
let navItems = document.querySelectorAll('.mobile__list__item-h');


menubutton.addEventListener('click', function(e) {
    sidebar.classList.toggle('open');
});

closebutton.addEventListener('click', function(e) {
    sidebar.classList.toggle('open');
});


    // console.log(navItem);

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        let current = '#' + this.id;
        let idName = this.dataset.subclass;  
        let idIcon = this.dataset.icon;
    
        let totalSubmenu = this.dataset.sub;
        let totalHeight = +totalSubmenu * 40;
    
        
        let navMainItem = document.querySelector(current);
        let navIcon = document.querySelector(`#${idIcon}`);
    
        // console.log(totalHeight);
    
        let navSubItem = document.querySelector(`#${idName}`)
        let isActive = navSubItem.classList.contains('msubmenu-acitve');
    
        // console.log(navSubItem);
    
        if(isActive) {
            navSubItem.classList.remove('msubmenu-acitve');
            navSubItem.style.height = 0 + 'px';
            navSubItem.style.marginTop = 0 + 'px';
            navIcon.classList.toggle('mn-toggle-btn-rotate');
        }
        else {
            navSubItem.classList.add('msubmenu-acitve');
            navSubItem.style.height = totalHeight + 'px';
            navSubItem.style.marginTop = 20 + 'px';
            navIcon.classList.toggle('mn-toggle-btn-rotate');
        }
       
    
    })
})

// navItems.addEventListener('click', )
