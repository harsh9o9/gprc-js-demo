const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

const client = new todoPackage.Todo(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

client.createTodo(
  {
    id: -1,
    text: text || "Do Laundry",
  },
  (err, res) => {
    console.log("createTodo Response: ", JSON.stringify(res));
  }
);

client.readTodos({}, (err, res) => {
  console.log("readTodos Response: ", JSON.stringify(res));
});

const readTodosStreamCall = client.readTodosStream();
readTodosStreamCall.on("data", (item) => {
  console.log("Stream res: ", JSON.stringify(item));
});

readTodosStreamCall.on("end", (e) => console.log("Stream resonse ended"));
