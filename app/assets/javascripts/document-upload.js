$(document).ready(function () {
    DocumentUpload.initDropzone();
});

var DocumentUpload = {
    initDropzone: function() {
        new Dropzone('.document-upload__dropzone', {
            url: '/upload-document',
            previewsContainer: '.document-upload__preview',
            headers: {
                'x-csrf-token': documentUploadContent.csrfToken
            },
            acceptedFiles: '.jpg,.bmp,.tiff,.png,.pdf',
            addRemoveLinks: true,
            previewTemplate: '<div class="dz-preview dz-file-preview"><div class="dz-error-message"><span data-dz-errormessage></span></div><div class="dz-details"><div class="dz-filename"><span data-dz-name></span></div></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div></div>',
            dictRemoveFile: documentUploadContent.removeFileText,
            dictInvalidFileType: documentUploadContent.invalidFileType
        })
        .on('addedfile', function() {
            DocumentUpload.hideNoFilesUploadedMessage();
        })
        .on('removedfile', function() {
            DocumentUpload.showNoFilesUploadedMessage();
            DocumentUpload.hideErrorSummary();
        })
        .on('error', function(item, error) {
            if (error === documentUploadContent.invalidFileType) {
                DocumentUpload.showErrorSummary(documentUploadContent.invalidFileTypeSummary, documentUploadContent.invalidFileType);
            }
        });

        $('.document-upload__dropzone-text--choose-file').click(function() {
            $('.document-upload__dropzone').click();
        });
    },
    showNoFilesUploadedMessage: function() {
        if ($('.dz-preview').length === 0) {
            $('.document-upload__no-files-uploaded-text').show();
        }
    },
    hideNoFilesUploadedMessage: function() {
        $('.document-upload__no-files-uploaded-text').hide();
    },
    showErrorSummary: function(errorSummary, errorOnField) {
        if ($('.error-summary').length === 0) {
            $('h1').before('<div class="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1"><h2 class="heading-medium error-summary-heading" id="error-summary-heading">' + documentUploadContent.errorSummaryHeading + '</h2><ul class="error-summary-list"><li><a href="#uploaded-files">' + errorSummary + '</a></li></ul></div>');
        }
    },
    hideErrorSummary: function() {
        if ($('.dz-error').length === 0) {
            $('.error-summary').remove();
        }
    }
}
