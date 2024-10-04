import * as addList from "./addList"
import * as addSong from "./addSong"
import * as deleteQueue from "./deleteQueue"
import * as disconnect from "./disconnect"
import * as empty from "./empty"
import * as error from "./error"
import * as finish from "./finish"
import * as finishSong from "./finishSong"
import * as initQueue from "./initQueue"
import * as noRelated from "./noRelated"
import * as playSong from "./playSong"
import * as searchCancel from "./searchCancel"
import * as searchDone from "./searchDone"
import * as searchInvalidAnswer from "./searchInvalidAnswer"
import * as searchNoResult from "./searchNoResult"
import * as ffmpegDebug from "./ffmpegDebug"


export const events = [
  addList,
  addSong,
  deleteQueue, //TODO
  disconnect, 
  empty,
  error, 
  finish, 
  finishSong, //TODO
  initQueue, //TODO DB
  noRelated, //TODO
  playSong, //TODO Queue
  searchCancel, //TODO
  searchDone, //TODO
  searchInvalidAnswer, //TODO
  searchNoResult, //TODO
  ffmpegDebug
]


