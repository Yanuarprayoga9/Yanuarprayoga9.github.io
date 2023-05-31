const books = [];
const RENDER_EVENT = 'RENDER_EVENT';
const SAVED_EVENT = 'SAVING_BOOK';
const STORAGE_KEY = 'BOOKSHELF_APP';
function isStorageExist(){
    if(typeof(Storage)===undefined){
        alert('your broswer not support web storage')
        return false;
    }else{
        return true;
    }
}

function saveData(){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY,parsed);

    document.dispatchEvent(new Event(SAVED_EVENT));
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null) {
        for (const book of data) {
        books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId(){
    return +new Date;
}
function generateBookObject(id,titlebook,author,year,iscomplete){
   return{
    id:id,
    title:titlebook,
    author:author,
    year:year,
    isComplete:iscomplete
   }
}
function addBook(){
    const inputTitle = document.getElementById('inputBookTitle').value;
    const inputAuthor = document.getElementById('inputBookAuthor').value;
    const inputYear = document.getElementById('inputBookYear').value;
    

    let idObject = generateId();

    let BookObject=generateBookObject(idObject,inputTitle,inputAuthor,inputYear,checkBox())
    books.push(BookObject);
    console.log(books);

    saveData()
    document.dispatchEvent(new Event(RENDER_EVENT))
}
const isCompleted = document.getElementById('inputBookIsComplete');
function check(){
    const innerBtn = document.getElementById('bookSubmit')
    if (isCompleted.checked) {
        innerBtn.innerText="Masukkan Buku ke rak Selesai Dibaca"
    } else{
        innerBtn.innerText="Masukkan Buku ke rak Belum Selesai Dibaca"   
    }
    
}
isCompleted.addEventListener('change',()=>{
    check();
})

function checkBox(){
    const isComplete = document.getElementById('inputBookIsComplete')
  
    
    if (isComplete.checked) {
        
        
        return true//jika sudah dicentang 


    } else {
        return false;
    }
    
}

// FUNGSI UNTUK BUTTON

function ofBook(book){
    for(const buku of books){
        if(buku.id==book){
            return buku;
        }
    }
    return null;
    
}
function undo(book){
    const undo = ofBook(book);
    console.log(undo)
    if (undo == null) return;

    undo.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
function transferToComplete(book){
    const undo = ofBook(book);
    console.log(undo)
    if (undo == null) return;

    undo.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
function indexDelete(book){
    for(const index in books){
        if(books[index].id === book){
        return index;
        }
    }
    return -1;
}
function deleteComplete(book){
    const target = indexDelete(book);

    if(target === -1) return;
    
    books.splice(target, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};
//
function createBook(book){
    const titleBookElement = document.createElement('h2');
    titleBookElement.innerText=`Judul : ${book.title}`;
    titleBookElement.classList.add('titleBook');
    console.log(book.title)

    const authorBookElement = document.createElement('h3');
    authorBookElement.innerText=`Penulis : ${book.author}`;
    authorBookElement.classList.add('authorBook');

    const yearBook = document.createElement('h3');
    yearBook.innerText=`Tahun terbit : ${book.year}`;
    yearBook.classList.add('tahun');


    console.log(book.author)
    const ContainerText = document.createElement("div");
    ContainerText.classList.add("ContainerText");
    ContainerText.append(titleBookElement, authorBookElement,yearBook);

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("itemAction");

    const container = document.createElement("div");
    container.classList.add("item");
    container.append(ContainerText);
    container.setAttribute("id", `book-${book.id}`);

    // <div class="container">
    //     <div class="textContainer">
    //       <p></p>
    //       <p></p>
    //     </div>
    //     <div class="actionContainer">
    //       jika isCompleted maka buat trash dan repeat
    //       jika blum selesai buat tombol ceklis/selsasi dan trash
    //     </div>
    //   </div>
    if(book.isComplete){
        const repeatBtn = document.createElement('button');
        repeatBtn.classList.add('repeatBtn')
        repeatBtn.innerHTML='Repeat';//membuat iScomplete menjadi false
        repeatBtn.addEventListener('click',()=>{
            undo(book.id)
        })        

        trashBtn = document.createElement('button');
        trashBtn.classList.add('trashBtn')
        trashBtn.innerHTML='Delete';//hapus menggunakan slice
        trashBtn.addEventListener('click',()=>{
            
            deleteComplete(book.id)
        })
        
        actionContainer.append(repeatBtn,trashBtn);
        container.append(actionContainer);
        
    }else{
        trashBtn = document.createElement('button');
        trashBtn.classList.add('trashBtn')
        trashBtn.innerHTML='Delete';//hapus menggunakan slice
        trashBtn.addEventListener('click',()=>{
            
            deleteComplete(book.id)
        })
        const Selesai = document.createElement('button');
        Selesai.classList.add('Selesai')
        Selesai.innerHTML='Selesai'//jadikan iScomplete menjadi true

        Selesai.addEventListener('click',()=>{
            
            transferToComplete(book.id)
        })
        
        actionContainer.append(Selesai,trashBtn);
        container.append(actionContainer);
    }
    return container;
}
// RENDER_EVENT
document.addEventListener(RENDER_EVENT,()=>{
    console.log(books);
    const inCompleteBook = document.getElementById('incompleteBookshelfList');
    inCompleteBook.innerHTML="";
    const completeBook = document.getElementById('completeBookshelfList');
    completeBook.innerHTML="";

    for(const book of books){
        const element = createBook(book)
        if(book.isComplete){
            
            completeBook.append(element);
        }else{
            
            inCompleteBook.append(element);
        }
    }
})


addEventListener('DOMContentLoaded',()=>{
    let SubmitForm = document.getElementById("inputBook");
    SubmitForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        addBook()
    })
    if (isStorageExist()) {
        loadDataFromStorage();
      }

})