$(document).ready(function () {
  new Dropzone('.document-upload__dropzone', {
    url: '/upload-document',
    previewsContainer: '.document-upload__preview',
    headers: {
        'x-csrf-token': csrfToken
    },
    addRemoveLinks: true,
    dictRemoveFile: documentUploadRemoveFileText
  })
  .on("addedfile", function() {
    $('.document-upload__no-files-uploaded-text').hide();
  })
  .on("removedfile", function() {
    if ($('.dz-preview').length === 0) {
        $('.document-upload__no-files-uploaded-text').show();
    }
  });
  $('.document-upload__dropzone-text--choose-file').click(function() {
    $('.document-upload__dropzone').click();
  });
});