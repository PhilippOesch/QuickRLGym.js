exports.mochaHooks = {
    afterEach() {
        sinon.restore();
    },
};
