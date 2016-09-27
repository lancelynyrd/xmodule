import { Injectable } from '@angular/core';
import { Storage, LocalStorage } from 'ionic-angular';
@Injectable()
export class Data {
  static storage: Storage = null;
  constructor() {
      console.log("Database::constructor()");
      if ( Data.storage ) {
          console.log("App is already connected to storage.");
      }
      else {
          console.log("Connecting to LocalStorage...");
          Data.storage = new Storage( LocalStorage, {name: 'appDb'} );
      }
  }
  get db () : Storage {
      return Data.storage;
  }
  /**
   * 
   * @deprecated. Do not use this method. Use Core.db.get();
   * 
   * @code
   * let data = new Data();
   * 
   * data.set('run', Math.round(new Date().getTime() / 1000 ));
      data.get('run', (v) => console.log(v));
      @endcode
   */
  get( key: string, callback: any ) : void {
      this.db.get( key )
        .then( x => callback(x) );
  }

  
  /**
   * 
   * 
   */
  set( key: string, value: any, callback?: any ) : void {
      this.db.set( key, value )
        .then( () => {
            if ( callback ) { callback() }
        } );
  }


}

