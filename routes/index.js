const express = require('express');
const staffRoute = require('./admin/index');
const NormaluserRoutes = require('./normal/index');
const docsRoute = require('./docs.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/admin',
        route: staffRoute,
    },
    {
        path: '/normal',
        route: NormaluserRoutes,
    },
    {
        path: '/docs',
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});


module.exports = router;
