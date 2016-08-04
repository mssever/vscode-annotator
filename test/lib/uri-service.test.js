
const UriService = require('../../lib/uri-service');

suite('UriService', () => {

    suite('#convertToAnnotateFileAction', () => {

        test('it converts file uri into annotate-file action uri', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const getCurrentDateFn = () => 'DATE';
            const uriService = new UriService({Uri, getCurrentDateFn});

            const uri = {
                fsPath: 'PATH',
                scheme: 'file'
            };
            expect(uriService.convertToAnnotateFileAction(uri)).to.eql('URI');
            expect(Uri.parse).to.have.been.calledWith(
                'annotator:annotate-file?path=PATH&_ts=DATE'
            );
        });

        test('it converts show-file action uri into annotate-file action uri of previous commit', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const uriService = new UriService({Uri});

            const uri = {
                path: 'show-file/FILE.js',
                scheme: 'annotator',
                query: 'path=DIR%2FFILE.js&commitHash=COMMIT_HASH&previousPath=PREVIOUS_PATH&previousCommitHash=PREVIOUS_COMMIT_HASH&repositoryRoot=REPOSITORY_ROOT'
            };
            expect(uriService.convertToAnnotateFileAction(uri)).to.eql('URI');
            expect(Uri.parse).to.have.been.calledWith(
                'annotator:annotate-file?path=PREVIOUS_PATH&commitHash=PREVIOUS_COMMIT_HASH&repositoryRoot=REPOSITORY_ROOT'
            );
        });

        test('it throws an error if unknown action is given', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const uriService = new UriService({Uri});

            const uri = {
                path: 'UNKNOWN_ACTION',
                scheme: 'annotator',
                query: 'path=PATH&commitHash=COMMIT_HASH&repositoryRoot=REPOSITORY_ROOT'
            };
            expect(() => uriService.convertToAnnotateFileAction(uri)).to.throws(Error);
        });

        test('it returns null if show-file action uri is given but previous commit is not available', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const uriService = new UriService({Uri});

            const uri = {
                path: 'show-file',
                scheme: 'annotator',
                query: 'path=PATH&commitHash=COMMIT_HASH&repositoryRoot=REPOSITORY_ROOT'
            };
            expect(uriService.convertToAnnotateFileAction(uri)).to.eql(null);
        });
    });

    suite('#encodeShowFileAction', () => {

        test('it encodes show-file action, putting filename in uri path so that the editor can find the file type', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const uriService = new UriService({Uri});

            const params = {
                path: '/DIR/FILE.js',
                repositoryRoot: 'REPOSITORY_ROOT',
                commitHash: 'COMMIT_HASH'
            };
            expect(uriService.encodeShowFileAction(params)).to.eql('URI');
            expect(Uri.parse).to.have.been.calledWith(
                'annotator:show-file/FILE.js?path=%2FDIR%2FFILE.js&repositoryRoot=REPOSITORY_ROOT&commitHash=COMMIT_HASH'
            );
        });

        test('it does not put a filename in the path if it is not given', () => {
            const Uri = {parse: sinon.stub().returns('URI')};
            const uriService = new UriService({Uri});

            const params = {
                repositoryRoot: 'REPOSITORY_ROOT',
                commitHash: 'COMMIT_HASH'
            };
            expect(uriService.encodeShowFileAction(params)).to.eql('URI');
            expect(Uri.parse).to.have.been.calledWith(
                'annotator:show-file?repositoryRoot=REPOSITORY_ROOT&commitHash=COMMIT_HASH'
            );
        });
    });

    suite('#getAction', () => {

        test('it recognise action of given uri', () => {
            const uriService = new UriService({});

            const uri = {
                scheme: 'annotator',
                path: 'show-file/FILE.js'
            };
            expect(uriService.getAction(uri)).to.eql('show-file');
        });

        test('it does not understand action if scheme of uri is not of this extension', () => {
            const uriService = new UriService({});

            const uri = {
                scheme: 'UNKNOWN_SCHEME',
                path: 'show-file/FILE.js'
            };
            expect(uriService.getAction(uri)).to.be.null;
        });
    });
});
