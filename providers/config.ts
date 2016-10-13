import { Injectable } from '@angular/core';
@Injectable()
export class Config {
    static serverUrl = "http://work.org/wordpress/index.php";
    static uploadUrl = Config.serverUrl + "?xapi=file.upload&type=any";
}