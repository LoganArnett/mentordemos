var PipeGraphicsComponent = function(entity) {
    this.entity = entity;
};

PipeGraphicsComponent.prototype.draw = function() {
    console.log("Drawing a Pipe");
};

exports.PipeGraphicsComponent = PipeGraphicsComponent;
