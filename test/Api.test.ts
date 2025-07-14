import Api from "../src/script/Api";

global.fetch = jest.fn();

describe("Api", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it.todo("should fetch a Pokemon and return valid JSON");
    it.todo("should handle names with spaces and format correctly");
    it.todo("should throw error when API returns non-200");
    it.todo("should throw error when network request fails");
    it.todo("should handle double name correctly");
});



