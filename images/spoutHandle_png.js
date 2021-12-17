/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAZCAYAAABD2GxlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASVJREFUeNrs1k1Kw0AcBfA3k0xWJdRoE2o3KrgRF8UTeARv4AEq6EpakJ6hV/AEuYJH8A4isZqiaJtOZzLERLyA+BZZ9B3g8ct8/SNAzHgyHVpr0qqqDhh9nufPfCawG+2mIOF+c0MFxkmfifsJFdiL+2g1cC9O2g2Moh4feDu+uyhLe4kK3f8UqSC4r28vH3h4dJySus6z7AlhuMMFnpye0cqEJ1EUSy4w2R/QyubZM9Z6zQW+L3Ja2fLrE8YYLjB/e6GVFasVnCvZwDmtzDkHkC9yDXyllSmlIKXkAhc5bwU7nRB+jaQCm4PNSrN6SgVcIPP111rDWtveWWw2GkIIOvChGVOErsd6N4bseUz93NHVNf1vQaLl2QK3wD9mRu77+BZgAApoXUz2BLY5AAAAAElFTkSuQmCC';
export default image;