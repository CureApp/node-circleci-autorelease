declare function describe(name:string, callback?: Function):void;
declare function xdescribe(name:string, callback?: Function):void;

declare function before(callback?: Function):void;
declare function xbefore(callback?: Function):void;

declare function beforeEach(callback?: Function):void;
declare function xbeforeEach(callback?: Function):void;

declare function after(callback?: Function):void;
declare function xafter(callback?: Function):void;

declare function afterEach(callback?: Function):void;
declare function xafterEach(callback?: Function):void;

declare function it(name:string, callback?: Function):void;
declare function xit(name:string, callback?: Function):void;

declare function context(name:string, callback?: Function):void;
declare function xcontext(name:string, callback?: Function):void;

declare function assert(bool: any):void;
