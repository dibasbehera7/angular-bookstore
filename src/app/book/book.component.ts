import { Component, OnInit } from '@angular/core';

import { Book } from './book';
import { BookService } from './book.service';

import {  takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  books: Book[];
  book = new Book();
  statusMessage: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.getBooks();
  }

  // Get all book details
  getBooks():void{
    this.bookService.getAllBooks().pipe(takeUntil(this.destroy$)).subscribe((data: Book[])=>{
      //console.log(data);
      this.books = data;
    },(error) =>{
      console.log(error);
      this.statusMessage = "Problem with service. Please try again later!";
    })  
  }

  //Unsubscribe
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  

  // Add Book details
addBook(){
  if(this.book.title == null || this.book.author == null)
  return window.alert("Cannot be blank...");

  this.bookService.addBook(this.book)
  .subscribe(
    data => {
      //console.log(data);
      this.reset();
      this.getBooks();
    },
    error => {
      console.log(error);
      this.statusMessage = "Problem with service. Please try again later!";
    });
}

  //Reset after record is added
  private reset(){
    this.book.id = null;
    this.book.title=null;
    this.book.author=null;
  }


  //Delete Functionality
  deleteBook(bookId: string){
    console.log("Inside the deleteBook()::::Book id::::"+bookId);
    this.bookService.deleteBook(bookId)
        .subscribe( (response) =>{
          console.log(response);
          this.getBooks();
          
        }, (error) => {
          console.log(error);
          this.statusMessage = "Problem with service. Please try again later!";
        })
        this.reset();
            console.log("end of deleteBook():::::::");
  } 

  //Get Particular Record for Updating
  getBookById(bookId:string){
    this.bookService.getBookById(bookId)
        .subscribe((bookData: Book) => {
          this.book = bookData;
          this.getBooks();
        },(error) =>{
          console.log(error);
          this.statusMessage = "Problem with service. Please try again later!";
        });
        this.reset();
  }
  
}
