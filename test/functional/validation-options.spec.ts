import "es6-shim";
import {Contains, MinLength, IsOptional, IsNotEmpty} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("validation options", function() {

    describe("message", function() {

        it("should contain a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "String is not valid. You string must contain a hello word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            // model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ contains: "String is not valid. You string must contain a hello word" });
            });
        });

        it("$value token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$value is not valid. You string must contain a hello word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ contains: "hell no world is not valid. You string must contain a hello word" });
            });
        });

        it("$value token should be replaced in a custom message", function() {
            class MyClass {
                @MinLength(2, {
                    message: args => {
                        if (args.value.length < 2) {
                            return "$value is too short, minimum length is $constraint1 characters $property";
                        }
                    }
                })
                name: string;
            }

            const model = new MyClass();
            model.name = "";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ minLength: " is too short, minimum length is 2 characters name" });
            });
        });

        it("$constraint1 token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "String is not valid. You string must contain a $constraint1 word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ contains: "String is not valid. You string must contain a hello word" });
            });
        });

        it("$target token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$target is not valid."
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ contains: "MyClass is not valid." });
            });
        });

        it("$property token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$property is not valid."
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ contains: "someProperty is not valid." });
            });
        });

        it("should replace all token", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$target#$property is not valid: $value must contain a $constraint1 word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ contains: "MyClass#someProperty is not valid: hell no world must contain a hello word" });
            });
        });

    });

    describe("each", function() {

        it("should apply validation to each item in the array", function() {
            class MyClass {
                @Contains("hello", {
                    each: true
                })
                someProperty: string[];
            }

            const model = new MyClass();
            model.someProperty = ["hell no world", "hello", "helo world", "hello world", "hello dear friend"];
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ contains: "each value in someProperty must contain a hello string" });
                errors[0].value.should.be.equal(model.someProperty);
                errors[0].target.should.be.equal(model);
                errors[0].property.should.be.equal("someProperty");
            });
        });

    });

    describe("groups", function() {

        class MyClass {
            @Contains("hello", {
                groups: ["title-validation"]
            })
            title: string;

            @Contains("bye", {
                groups: ["text-validation"]
            })
            text: string;
        }

        const model1 = new MyClass();
        model1.title = "hello world";
        model1.text = "hello world";

        const model2 = new MyClass();
        model2.title = "bye world";
        model2.text = "bye world";

        const model3 = new MyClass();
        model3.title = "bye world";
        model3.text = "hello world";

        const model4 = new MyClass();
        model4.title = "hello world";
        model4.text = "bye world";

        it("should validate only properties of the given group", function() {
            return validator.validate(model1, { groups: ["title-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should validate only properties of the given group", function() {
            return validator.validate(model2, { groups: ["title-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given group", function() {
            return validator.validate(model2, { groups: ["text-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should validate only properties of the given group", function() {
            return validator.validate(model1, { groups: ["text-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model1, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model2, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model3, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(2);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model4, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model1).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model2).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model3).then(errors => {
                errors.length.should.be.equal(2);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model4).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

    });

    describe("alwaysDefault", function() {

        class MyClass {
            @Contains("noOptions")
            noOptions: string;

            @Contains("groupA", {
                groups: ["A"]
            })
            groupA: string;

            @Contains("alwaysFalse", {
                always: false
            })
            alwaysFalse: string;

            @Contains("alwaysTrue", {
                always: true
            })
            alwaysTrue: string;
        }

        const model1 = new MyClass();
        model1.noOptions = "XXX";
        model1.groupA = "groupA";
        model1.alwaysFalse = "alwaysFalse";
        model1.alwaysTrue = "alwaysTrue";

        const model2 = new MyClass();
        model2.noOptions = "noOptions";
        model2.groupA = "XXX";
        model2.alwaysFalse = "alwaysFalse";
        model2.alwaysTrue = "alwaysTrue";

        const model3 = new MyClass();
        model3.noOptions = "noOptions";
        model3.groupA = "groupA";
        model3.alwaysFalse = "XXX";
        model3.alwaysTrue = "alwaysTrue";

        const model4 = new MyClass();
        model4.noOptions = "noOptions";
        model4.groupA = "groupA";
        model4.alwaysFalse = "alwaysFalse";
        model4.alwaysTrue = "XXX";

        it("should validate decorator without options", function() {
            return validator.validate(model1, { alwaysDefault: true, groups: ["A"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should not validate decorator with groups if validating without matching groups", function() {
            return validator.validate(model2, { alwaysDefault: true, groups: ["B"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should not validate decorator with always set to false", function() {
            return validator.validate(model3, { alwaysDefault: true, groups: ["A"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should validate decorator with always set to true", function() {
            return validator.validate(model4, { alwaysDefault: true, groups: ["A"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

    });

    describe("strictGroups", function() {

        class MyClass {

            @IsOptional({ groups: ["A"] })
            @IsNotEmpty({ always: true })
            a: string;

        }

        const model1 = new MyClass();

        it("should ignore decorators with groups if validating without groups", function() {
            return validator.validate(model1, { strictGroups: true }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should ignore decorators with groups if validating with empty groups array", function() {
            return validator.validate(model1, { strictGroups: true, groups: [] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should include decorators with groups if validating with matching groups", function() {
            return validator.validate(model1, { strictGroups: true, groups: ["A"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

    });


    describe("always", function() {

        class MyClass {
            @Contains("hello", {
                groups: ["title-validation"]
            })
            title: string;

            @Contains("bye", {
                groups: ["text-validation"],
                always: true
            })
            text: string;
        }

        const model1 = new MyClass();
        model1.title = "hello world";
        model1.text = "hello world";

        const model2 = new MyClass();
        model2.title = "bye world";
        model2.text = "bye world";

        it("should always validate a marked field no matter if group is specified", function() {
            return validator.validate(model1, { groups: ["title-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should always validate a marked field no matter if group is specified", function() {
            return validator.validate(model2, { groups: ["text-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

    });

});
