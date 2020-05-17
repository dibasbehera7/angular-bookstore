import { HttpClient , HttpErrorResponse , HttpResponse , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from './book';
import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable()
export class BookService{

    /*
      NOTE: please change this url based your rest apis
    */
    private GET_BOOK_API = "http://localhost:8080/bookapi/api/book";
    private POST_BOOK_API = "http://localhost:8080/bookapi/api/book";
    private DELETE_API = "http://localhost:8080/bookapi/api/book/";
    private PUT_API = "http://localhost:8080/bookapi/api/book/";

    constructor(private httpClient: HttpClient){}

    //Error Handler in Project
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        //window.alert(errorMessage);
        return throwError(errorMessage);
      }

      //Get all book details
    public getAllBooks(){
      return this.httpClient.get(this.GET_BOOK_API).pipe(retry(1), catchError(this.handleError));
    }

    //Add Book Details
    public addBook(book: Book){
      //let body = JSON.stringify(book); no more needed in angular 8+
      if(book.id){
        return this.httpClient.put(this.PUT_API+book.id, book, { 'responseType':'text'});
      }else{
        return this.httpClient.post(this.POST_BOOK_API, book, { 'responseType':'text' });
      }
    }

    //Delete a particular book
    deleteBook(bookId:string){
      return this.httpClient.delete(this.DELETE_API+bookId,{
        'responseType':'text'
      });
    }

    //Get Particular Book
    getBookById(bookId:string){
      return this.httpClient.get(this.PUT_API+bookId).pipe(retry(1), catchError(this.handleError));
    }

    
}