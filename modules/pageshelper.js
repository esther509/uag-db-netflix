

exports.createRenderParams=function(session, extras={}) {
    var sessname = "";
    if (session && session.username) {
        sessname = session.username;
    }
    var sesstype = "";
    if (session && session.type) {
        sesstype = session.type;
    }
    var base = { title: 'UAG Netflix', username: sessname, usertype: sesstype };
    for (var attrname in extras) { base[attrname] = extras[attrname]; }
    return base;
};