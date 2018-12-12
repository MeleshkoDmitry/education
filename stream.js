'use strict';

const { Readable, Writable } = require('stream');


class Readabled extends Readable {
  constructor(data = [], options = {}) {
    super(options);
    this.data = data;
    this.info();
    this.readData();
  }

  info() {
    console.log('objectMode ', this._readableState.objectMode);
    console.log('highWaterMark ', this._readableState.highWaterMark);
    console.log('buffer ', this._readableState.buffer);
    console.log('length ', this._readableState.length);
    console.log('flowing ', this._readableState.flowing);
  }

  readData() {
    this.on('data', (chunk) => {
      console.log('Readable on data: ', chunk.toString(), ' buffer of chunk ', this._readableState.buffer);
    })
      .on('error', (err) => {
        console.log('Readable on error ', err);
      })
      .on('end', () => {
        console.log('Readable on end ');
        this.info();
      })
      .on('close', () => {
        console.log('Readable on close');
      });

  }
  _read() {
    const buffer = this.data.shift()
    if (!buffer) {
      this.push(null);
    } else {
      this.push(buffer);
    }
  }
}

class Writer extends Writable {
  constructor(options = {}) {
    super(options);
    console.log('objectMode ', this._writableState.objectMode);
    console.log('highWaterMark ', this._writableState.highWaterMark);
    console.log('decodeStrings ', this._writableState.decodeStrings);
    console.log('buffer ', this._writableState.getBuffer());

    this.on('drain', () => {
      console.log('\n------ writable on drain');
    })
      .on('error', (err) => {
        console.log('\n------ writable on error', err);
      })
      .on('finish', () => {
        console.log('\n------ writable on finish');
        console.log('BUFFER:', this._writableState.getBuffer());
      });
  }

  _write(chunk, encoding, done) {
    console.log('BUFFER', this._writableState.getBuffer());

    console.log(`chunk = ${JSON.stringify(chunk)}; isBuffer ${Buffer.isBuffer(chunk)}; chunk.length is ${chunk.length}; encoding = ${encoding}`);
    done();
  }
}

const data = [{ [Math.random()]: Math.random() }, { [Math.random()]: Math.random() }, { [Math.random()]: Math.random() }];
const R = new Readabled(data, { objectMode: true });

const W = new Writer({ objectMode: true });
R.pipe(W);
