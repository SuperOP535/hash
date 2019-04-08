var $ = document.querySelector.bind(document);

$('#mode').onchange = function() {
    if(this.value === 'File') {
        $('#file').style.display = '';
        $('#text').style.display = 'none';
    } else {
        $('#file').style.display = 'none';
        $('#text').style.display = 'block';
    }
};

var fileContent1;
var fileContent2;
var fileReader1 = new FileReader();
var fileReader2 = new FileReader();

$('#file1').onchange = function() {
    fileReader1.readAsArrayBuffer(this.files[0]);
    fileReader1.onloadend = function() {
        fileContent1 = this.result;
    };
};


$('#file2').onchange = function() {
    fileReader2.readAsArrayBuffer(this.files[0]);
    fileReader2.onloadend = function() {
        fileContent2 = this.result;
    };
};

$('#compare_on').onchange = function() {
    $('#file2').style.display =
    $('#text2').style.display =
    $('#hash2').style.display = this.checked ? 'block' : '';
    $('#compare').style.display = this.checked ? 'inline' : '';
};

$('#hash').onclick = function() {
    var isFile = $('#mode').value === 'File';
    if($('#kind').value.slice(0, 3) === 'SHA') {
        var hash = new jsSHA($('#kind').value, isFile ? 'ARRAYBUFFER' : 'TEXT');
        hash.update(isFile ? fileContent1 : $('#text1').value);
        $('#hash1').value = hash.getHash('HEX');
        if($('#compare_on').checked) {
            var hash2 = new jsSHA($('#kind').value, isFile ? 'ARRAYBUFFER' : 'TEXT');
            hash2.update(isFile ? fileContent2 : $('#text2').value);
            $('#hash2').value = hash2.getHash('HEX');
        }
    } else { // MD5
        if(isFile) {
            $('#hash1').value = SparkMD5.ArrayBuffer.hash(fileContent1);
            if($('#compare_on').checked)
                $('#hash2').value = SparkMD5.ArrayBuffer.hash(fileContent2);
        } else {
            $('#hash1').value = SparkMD5.hash($('#text1').value);
            if($('#compare_on').checked)
                $('#hash2').value = SparkMD5.hash($('#text2').value);
        }
    }
};

$('#compare').onclick = function() {
    if(!$('#hash1').value)
        alert('Hash value 1 missing');
    else if(!$('#hash2').value)
        alert('Hash value 2 missing');
    else if($('#hash1').value === $('#hash2').value)
        alert('Hash matches!');
    else
        alert('Hash does not match!');
};