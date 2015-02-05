/**
 * Instructions for updating this file.
 * - this file must be updated everytime a new cross-folder dependency is added
 *   into any of the [refs.ts] file. For instance, if suddenly you add a
 *   reference to [../storage/whatever.ts] in [libwinRT/refs.ts], then you must
 *   update the dependencies of the [libwinRT/refs.d.ts] task.
 **/
var child_process = require("child_process");
var fs = require("fs");

// The local [tsc] compiler.
var tsc = "node node_modules/typescript/bin/tsc";

// The list of files generated by the build.
// XXX put everything in the build/ directory and make the clean task just rmRf
// that directory.
var generated = [
  'shell/npm/package.json',
  'touchdevelop.tgz',
  'results.html',
  'results.json',
  'browser.js',
  'shell/npm/bin/touchdevelop.js',
];

function mkTscCall(dir, refs, out) {
    return [
        tsc,
        "--noEmitOnError",
        "--target ES5",
        "--module commonjs",
        "--declaration",
        out ? "--out build/"+dir+".js" : "",
        dir+"/"+refs+".ts"
    ].join(" ");
}

function mkSimpleTask(production, dependencies, folder, target, isStandalone) {
    generated.push('build/'+folder+'.js');
    generated.push('build/'+folder+'.d.ts');

    return file(production, dependencies, { async: true }, function () {
        console.log("[B] "+production);
        jake.exec(mkTscCall(folder, target, !isStandalone), { printStdout: true }, function () {
            complete();
        });
    });
}

// A series of compile-and-run rules that generate various files for the build
// system. They currently have to run from the [build] directory but this is
// FIXME

function runInBuildAndComplete(cmds) {
    process.chdir("build");
    jake.exec(cmds, {}, function() {
        process.chdir("..");
        complete();
    });
}

mkSimpleTask('genStubs/genmeta.js', [ 'genStubs', ], "genStubs", "genmeta", true);
file('build/api.js', [ "genStubs/genmeta.js" ], { async: true }, function () {
    console.log("[P] generating build/api.js, localization.json and topiclist.json");
    runInBuildAndComplete([
        "node ../genStubs/genmeta.js",
    ]);
});
generated.push('build/api.js');
generated.push('build/localization.json');
generated.push('build/topiclist.json');

mkSimpleTask('cssPrefixes/addCssPrefixes.js', [ 'cssPrefixes' ], "cssPrefixes", "addCssPrefixes");
task('css-prefixes', [ "cssPrefixes/addCssPrefixes.js" ], { async: true }, function () {
    console.log("[P] modifying in-place all css files");
    runInBuildAndComplete([
        "node ../cssPrefixes/addCssPrefixes.js"
    ]);
});

mkSimpleTask('shell/shell.js', [], "shell", "shell", true);
mkSimpleTask('shell/package.js', [ 'shell/shell.js' ], "shell", "package", true);
file('build/pkgshell.js', [ 'shell/package.js' ], { async: true }, function () {
    console.log("[P] generating build/pkgshell.js and packaging");
    runInBuildAndComplete([
        "node ../shell/package.js"
    ]);
});
generated.push('build/pkgshell.js');


// These dependencies have been hand-crafted by reading the various [refs.ts]
// files. The dependencies inside the same folder are coarse-grained: for
// instance, anytime something changes in [editor/], [editor/refs.d.ts] gets
// rebuilt. This amounts to assuming that for all [foo/bar.ts], [bar.ts] appears
// in [foo/refs.ts].
mkSimpleTask('browser/browser.d.ts', [
    'browser/browser.ts'
], "browser", "browser");
mkSimpleTask('rt/refs.d.ts', [
    'browser/browser.d.ts',
    'rt',
    'lib'
], "rt", "refs");
mkSimpleTask('storage/refs.d.ts', [
    'rt/refs.d.ts',
    'rt/typings.d.ts',
    'browser/browser.d.ts',
    'storage'
], "storage", "refs");
mkSimpleTask('ast/refs.d.ts', [
    'rt/refs.d.ts',
    'ast'
], "ast", "refs");
mkSimpleTask('libwinRT/refs.d.ts', [
    'rt/refs.d.ts',
    'browser/browser.d.ts',
    'libwinRT'
], "libwinRT", "refs");
mkSimpleTask('libwab/refs.d.ts', [
    'rt/refs.d.ts',
    'rt/typings.d.ts',
    'browser/browser.d.ts',
    'libwab'
], "libwab", "refs");
mkSimpleTask('libnode/refs.d.ts', [
    'rt/refs.d.ts',
    'rt/typings.d.ts',
    'libnode'
], "libnode", "refs");
mkSimpleTask('libcordova/refs.d.ts', [
    'rt/refs.d.ts',
    'rt/typings.d.ts',
    'browser/browser.d.ts',
    'libcordova'
], "libcordova", "refs");
mkSimpleTask('editor/refs.d.ts', [
    'rt/typings.d.ts',
    'browser/browser.d.ts',
    'rt/refs.d.ts',
    'ast/refs.d.ts',
    'storage/refs.d.ts',
    'libwinRT/refs.d.ts',
    'libwab/refs.d.ts',
    'libcordova/refs.d.ts',
    'intellitrain',
    'editor'
], "editor", "refs");
mkSimpleTask('officemix/officemix.d.ts', [
    'officemix'
], "officemix", "officemix");
mkSimpleTask('noderunner/jsonapi.d.ts', [], "noderunner", "jsonapi");
mkSimpleTask('nodeclient/client.js', [
    'rt/typings.d.ts',
    'noderunner/jsonapi.d.ts'
], "nodeclient", "client", true);
// XXX coarse-grained dependencies here over the whole 'noderunner' directory
mkSimpleTask('noderunner/runner.d.ts', [
    'browser/browser.d.ts',
    'rt/typings.d.ts',
    'rt/refs.d.ts',
    'ast/refs.d.ts',
    'libnode/refs.d.ts',
    'noderunner'
], "noderunner", "runner", true);
// XXX same here
mkSimpleTask('runner/refs.d.ts', [
    'browser/browser.d.ts',
    'rt/typings.d.ts',
    'rt/refs.d.ts',
    'storage/refs.d.ts',
    'libwinRT/refs.d.ts',
    'libwab/refs.d.ts',
    'libnode/refs.d.ts',
    'libcordova/refs.d.ts',
    'runner'
], "runner", "refs");
// XXX same here
mkSimpleTask('mc/refs.d.ts', [
    'browser/browser.d.ts',
    'rt/typings.d.ts',
    'rt/refs.d.ts',
    'storage/refs.d.ts',
    'mc'
], "mc", "refs");


// Now come the rules for files that are obtained by concatenating multiple
// _js_ files into another one. The sequence exactly reproduces what happened
// previously, as there are ordering issues with initialization of global variables
// (unsurprisingly). Here's the semantics of these entries:
// - files ending with ".js" end up as dependencies (either as rule names, or as
//   statically-checked-in files in the repo, such as [langs.js]), and are
//   concatenated in the final file
// - files without an extension generate a dependency on the ".d.ts" rule and
//   the ".js" compiled file ends up in the concatenation
var concatMap = {
    "mcrunner.js": [
      "rt/refs",
      "storage/refs",
      "mc/refs",
    ],
    "noderunner.js": [
        "browser/browser",
        "rt/refs",
        "ast/refs",
        "build/api.js",
        "build/langs.js",
        "libnode/refs",
        "build/pkgshell.js",
        "noderunner/runner",
    ],
    "runtime.js": [
        "rt/refs",
        "storage/refs",
        "libwinRT/refs",
        "libwab/refs",
        "libnode/refs",
        "libcordova/refs",
        "runner/refs",
    ],
    "main.js": [
        "rt/refs",
        "ast/refs",
        "build/api.js",
        "build/langs.js",
        "storage/refs",
        "libwinRT/refs",
        "libwab/refs",
        "libcordova/refs",
        "build/pkgshell.js",
        "editor/refs" ,
    ],
};

generated.push(Object.keys(concatMap));

// Apparently our node scripts can't run without this line.
var nodePrelude = "var window = {};\n";

Object.keys(concatMap).forEach(function (f) {
    var isJs = function (s) { return s.substr(s.length - 3, 3) == ".js"; };
    var buildDeps = concatMap[f].map(function (x) { if (isJs(x)) return x; else return x + ".d.ts"; });
    var toConcat = concatMap[f].map(function (x) { if (isJs(x)) return x; else return x + ".js"; });
    file(f, buildDeps, function () {
        console.log("[C]", f);
        var bufs = [];
        bufs.push(new Buffer(nodePrelude));
        toConcat.forEach(function (f) {
            bufs.push(fs.readFileSync(f));
        });
        fs.writeFileSync(f, Buffer.concat(bufs));
    });
});

// Our targets are the concatenated files, which are the final result of the
// compilation. We also re-run the CSS prefixes thingy everytime.
task('default', [ 'css-prefixes' ].concat(Object.keys(concatMap)), function () {
    console.log("[I] build completed.");
});

task('clean', [], function () {
    // XXX do this in a single call? check out https://github.com/mde/utilities/blob/master/lib/file.js
    generated.forEach(function (f) { jake.rmRf(f); });
});

task('test', [ 'nodeclient/client.js', 'default' ], { async: true }, function () {
    jake.exec([ 'node nodeclient/client.js buildtest' ], {}, function() { complete(); });
});

task('run', [ 'default' ], { async: true }, function (port) {
    port = port || 80;
    // XXX fix this too
    console.log("[F] copying browser/browser.js to browser.js");
    if (fs.exists("browser.js"))
      fs.unlink("browser.js");
    fs.writeFileSync("browser.js", fs.readFileSync("browser/browser.js"));
    jake.exec(
        [ 'node noderunner '+port+' silent ' ],
        { printStdout: true, printStderr: true },
        function() { complete(); }
    );
});

task('local', [ 'default' ], { async: true }, function() {
  jake.exec(
    [ 'node shell/shell.js TD_ALLOW_EDITOR=true TD_LOCAL_EDITOR_PATH=.' ],
    { printStdout: true, printStderr: true },
    function() { complete(); }
  )
})

task('update-docs', [ 'nodeclient/client.js', 'default' ], { async: true }, function() {
  jake.exec(
    [ 'node nodeclient/client.js updatehelp',
      'node nodeclient/client.js updatelang' ],
    { printStdout: true, printStderr: true },
    function() { complete(); }
  )
})

