import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable()
export class Data {
  constructor( private storage: Storage ) {
  }
  get db () : Storage {
      return this.storage;
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
  /*
  get( key: string, callback: any ) : void {
      this.db.get( key )
        .then( x => callback(x) );
  }
  */

  
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

