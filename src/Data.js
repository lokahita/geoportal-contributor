import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useState, useEffect } from 'react';
import { setCookie } from './Helpers';
import { PencilSquare, Trash, Printer, Download, ArrowRepeat, FileEarmarkExcel } from 'react-bootstrap-icons';
import image_loader from './loading.gif';
import Config from './config.json';
import { getCookie } from './Helpers';
import JSZip from 'jszip';

export default function Data(props) {
    const [loading, setloading] = useState(true);
    //const user = 'admin';
    //const password = '******';

    //const auth = Buffer.from(user + ':' + password).toString('base64');
    const auth = Config.auth
    const token = getCookie('USER_TOKEN');
    const username = getCookie('CONTRIBUTOR');
    //const base_domain = Config.base_domain;

    const url_list = Config.api_domain + "/contribution/username/" + username;
    const url_insert_data = Config.api_domain + "/data/";
    const url_update_data = Config.api_domain + "/data/update/";
    const url_publish_data = Config.api_domain + "/data/publish/";
    const url_insert = Config.api_domain + "/contribution/";
    const url_update = Config.api_domain + "/contribution/update/";
    const url_delete = Config.api_domain + "/contribution/delete/";
    const url_upload = Config.geoserver_domain + "rest/workspaces/fta/datastores/" + username + "/file.shp";

    const [isFormVisible, setFormVisible] = useState(false);
    const [isGeoserverVisible, setGeoserverVisible] = useState(false);
    const [modeUsulan, setModeUsulan] = useState("tambah");
    const [tombolUsulan, setTombolUsulan] = useState("Submit");

    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [items, setItems] = useState();


    const [alert, setAlert] = useState("d-none");
    const [error, setError] = useState("d-none");

    const status = isFormVisible ? 'main-card mt-2 d-block' : 'd-none';
    const status_wms = isGeoserverVisible ? 'main-card mt-2 d-block' : 'd-none';
    const tabel = !isFormVisible && !isGeoserverVisible ? 'main-card d-block' : 'd-none';

    const [selectedFile, setSelectedFile] = useState();
    const [list, setList] = useState();
    const [shapeFile, setShapeFile] = useState();
    const [url, setUrl] = useState('Automatically generated from geoserver response');
    const [path, setPath] = useState();
    const [fileName, setFileName] = useState();

    const url_reflect = Config.geoserver_domain + "wms/reflect?layers=fta:";
    const url_store = Config.geoserver_domain + "rest/workspaces/fta/datastores/" + username + ".json";
    const url_publish = Config.geoserver_domain + "rest/workspaces/fta/datastores/" + username + "/external.shp";
    //http://localhost:8600/geoserver/rest/workspaces/cifor/datastores/roads/external.shp
    //http://localhost/geoserver/rest/workspaces/cifor/datastores/emhayusa.json
    const url_featuretypes = Config.geoserver_domain + "rest/workspaces/fta/datastores/" + fileName + "_" + username + "/featuretypes";
    //http://localhost/geoserver/rest/workspaces/cifor/datastores/emhayusa/featuretypes/ADMINISTRASIDESA_AR_25K.json
    const url_wms = Config.geoserver_domain + "fta/wms?service=WMS&version=1.1.0&request=GetMap&layers=fta:"

    //const [selectedStyle, setSelectedStyle] = useState();

    function onFileChange(event) {

        // Update the state
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0])
            //console.log(event.target.files[0])
            //console.log(event.target)
            var a = document.getElementsByClassName('custom-file-label');
            //console.log(a);
            if (typeof (event.target.files[0].name) !== 'undefined')
                a[0].innerHTML = event.target.files[0].name
            else
                a[0].innerHTML = 'Upload File'

            var filesInput = event.target.files[0];
            var list = document.getElementById("list");

            JSZip.loadAsync(filesInput)                                   // 1) read the Blob
                .then(function (zip) {
                    setFileName(event.target.files[0].name.replace(".zip", ""))
                    /*
                    var dateAfter = new Date();
                    $title.append($("<span>", {
                        "class": "small",
                        text: " (loaded in " + (dateAfter - dateBefore) + "ms)"
                    }));
                    */
                    var tabel = '<ul>';
                    var cek = false;
                    zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                        console.log(zipEntry.name);
                        if (zipEntry.name.includes(".shp")) {
                            if (!zipEntry.name.includes(".xml")) {
                                cek = true;
                                setShapeFile(zipEntry.name.replace(".xml", ""))
                                //fetchStore(zipEntry.name.replace(".xml", ""))
                            }

                        }
                        tabel += "<li>" + zipEntry.name + "</li>";
                        //$fileContent.append($("<li>", {
                        //    text: zipEntry.name
                        //}));
                    });
                    tabel += '</ul>';
                    if (cek) {
                        list.innerHTML = tabel;
                        //setList(tabel)
                    } else {
                        list.innerHTML = 'File not found in the given zip file';
                        //setList('File not found in the given zip file');
                    }
                }, function (e) {
                    console.log(e.message)
                    /*$result.append($("<div>", {
                        "class": "alert alert-danger",
                        text: "Error reading " + f.name + ": " + e.message
                    }));
                    */
                });
            /* var reader = new FileReader();
            reader.readAsBinaryString(filesInput);
    
            reader.onloadend = function (e) {
                var myZip = e.target.result;
                var unzipper = new JSUnzip(myZip);
    
                unzipper.readEntries();
                var myFiles = unzipper.entries;
    
                for (var i = 0; i < myFiles.length; i++) {
                    var name = myFiles[i].fileName; // This is the file name
                    console.log(name)
                    //var content = JSInflate.inflate(myFiles[i].data); // this is the content of the files within the zip file.
                }
            }*/
        }

    }


    function validateForm() {
        //console.log(wilayahId)
        if (modeUsulan === "hapus")
            return true
        else if (modeUsulan === "ubah")
            return name.length > 0
        else
            return name.length > 0 && selectedFile;

    }


    function getRowsData() {
        if (typeof (items) !== 'undefined') {
            //var items=props.presensiDataLast.data;
            if (items !== null) {
                if (items.length > 0) {

                    return items.map((row, index) => {
                        //console.log(row.id, index)
                        // 
                        //var name = 'Batas Desa'
                        //var filename = 'AdminDesa.zip'
                        //var time = '2021-07-19T12:25:42.309399'
                        //var url = 'http://localhost:8600/geoserver/emhayusa/wms?service=WMS&version=1.1.0&request=GetMap&layers=emhayusa%3AADMINISTRASIDESA_AR_25K&bbox=110.46332454500002%2C-7.148200475999957%2C110.83358016000014%2C-6.708177010999929&width=646&height=768&srs=EPSG%3A4326&styles=&format=image%2Fpng'
                        return <tr key={index}><td>{index + 1}</td><td>{row.data_name}</td><td>{row.filename}</td><td>{row.time_uploaded}</td><td style={{ maxWidth: "200px", overflowWrap: "break-word" }}>{row.url}</td><td> <Button type="submit" variant="warning" size="sm" inline="true" onClick={() => setModeEdit(row)} size="sm" className="px-1 py-0" ><PencilSquare size={12} /></Button> <Button type="submit" variant="danger" size="sm" onClick={() => setModeDelete(row)} className="px-1 py-0" ><Trash size={12} /></Button></td></tr>
                    })
                } else {
                    return <tr><td colSpan={6}>No data found</td></tr>
                }
            } else {
                return <tr><td colSpan={6}>No data found</td></tr>
            }
        } else {
            return <tr><td colSpan={6}>Accessing Data {loader}</td></tr>
        }
    }

    function load_usulan() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        };

        fetch(url_list, requestOptions).then(res => res.json()).then(data => {
            if (data.status === "Expired token") {
                window.location.replace(Config.base_domain)
            } else {
                console.log(data);
                setItems(data.data);
            }
        });
    }

    function setModeInsert() {
        setId(0);
        setName("");
        setUrl("Automatically generated from geoserver response");
        //setAddress("");
        setSelectedFile();
        var reflect = document.getElementById('reflect');
        reflect.innerHTML = "";

        var a = document.getElementsByClassName('custom-file-label');
        a[0].innerHTML = 'Upload File'
        var l = document.getElementById('list');
        l.innerHTML = '';
        setModeUsulan("tambah");
        setFormVisible(true);
        setGeoserverVisible(false);
        setTombolUsulan("Upload");
    }

    function setModeEdit(r) {
        console.log(r);
        setId(r.id);
        //setKodeMisi(1);
        //setKodeBidang(1);
        setName(r.data_name);
        setUrl(r.url);
        setShapeFile(r.filename)
        var reflect = document.getElementById('reflect');
        reflect.innerHTML = "";
        var img = document.createElement('img');
        var refl = url_reflect + r.filename
        img.src = refl.replace(".shp", "");
        reflect.append(img);

        var a = document.getElementsByClassName('custom-file-label');
        a[0].innerHTML = 'Upload File'
        var l = document.getElementById('list');
        l.innerHTML = '';

        setModeUsulan("ubah");
        setFormVisible(true);
        setTombolUsulan("Update");
        //window.scrollBy(0, 150);
    }

    function setModeDelete(r) {
        setId(r.id);
        setName(r.data_name);
        setUrl(r.url);
        var reflect = document.getElementById('reflect');
        reflect.innerHTML = "";
        //
        var a = document.getElementsByClassName('custom-file-label');
        a[0].innerHTML = 'Upload File'
        var l = document.getElementById('list');
        l.innerHTML = '';

        setModeUsulan("hapus");
        setFormVisible(true);
        setTombolUsulan("Delete");
        //window.scrollBy(0, 150);
    }

    const saveData = async (url_r) => {

        //var btn = document.querySelector("#ulangi");
        var msg = document.querySelector("#message");
        var err = document.querySelector("#error");
        //setError('d-block alert-info');
        //console.log(loader);
        err.innerHTML = 'please wait..';


        try {
            // Fetch data from REST API
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    "name": name,
                    "filename": shapeFile,
                    "username": username,
                    "url": url_r
                })
            };

            const response = await fetch(url_insert, requestOptions)
            //console.log(response)

            var json = await response.json();
            //console.log(json);
            //console.log(json.status);

            if (response.status === 201) {
                //console.log(data);
                setAlert('d-block alert-success')
                setError('d-none')
                msg.innerHTML = json.message;
                load_usulan();
                setId(0);
                setName("");
                //setAddress("");
                setFormVisible(false);
                //setGeoserverVisible(false);
            } else {
                setError('d-block alert-danger')
                err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }

        } catch (error) {
            setError('d-block alert-danger')
            msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }
    };

    const updateData = async (url_r) => {

        //var btn = document.querySelector("#ulangi");
        var msg = document.querySelector("#message");
        var err = document.querySelector("#error");
        //setError('d-block alert-info');
        //console.log(loader);
        err.innerHTML = 'please wait..';


        try {
            // Fetch data from REST API
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    "id": id,
                    "name": name,
                    "filename": shapeFile,
                    "url": url_r
                })
            };

            const response = await fetch(url_update, requestOptions)
            //console.log(response)

            var json = await response.json();
            //console.log(json);
            //console.log(json.status);

            if (response.status === 201) {
                //console.log(data);
                setAlert('d-block alert-success')
                setError('d-none')
                msg.innerHTML = json.message;
                load_usulan();
                setId(0);
                setName("");
                //setAddress("");
                setFormVisible(false);
                //setGeoserverVisible(false);
            } else {
                setError('d-block alert-danger')
                err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }

        } catch (error) {
            setError('d-block alert-danger')
            msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }
    };

    const fetchStore = async (shape) => {
        //console.log(shape)
        try {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", auth);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await fetch(url_store, requestOptions)
            //console.log(response)
            var json = await response.json();
            //var rsp = await response.text();
            //console.log(json);
            //console.log(json.status);
            console.log('a');
            if (response.status === 200) {
                console.log(json);
                console.log(shape.replace(".shp", ""))
                //console.log(json.dataStore.connectionParameters.entry[1].$);
                var p = json.dataStore.connectionParameters.entry[1].$;
                console.log(p)
                console.log(p.substring(0, p.lastIndexOf("/")))
                if (!p.includes(".shp")) {
                    setPath(p)
                } else {
                    //var spiltter = p.split("/");
                    setPath(p.substring(0, p.lastIndexOf("/")))
                }
                //setUrl('ssss')
            } else {
                // setError('d-block alert-danger')
                //err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }

        } catch (error) {
            //setError('d-block alert-danger')
            //msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }

    };


    const tambahData = async () => {

        //var btn = document.querySelector("#ulangi");
        var msg = document.querySelector("#message");
        var err = document.querySelector("#error");
        setError('d-block alert-info');
        //console.log(loader);
        err.innerHTML = 'please wait..';


        try {
            var file = document.getElementById('custom-file'); //document.querySelector("#proposalFile");

            const formData = new FormData();
            formData.append('file', file.files[0]);
            formData.append('username', username);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: formData
            };

            const response = await fetch(url_insert_data, requestOptions)
            //console.log(response)

            var json = await response.json();
            //console.log(json);
            //console.log(json.status);

            if (response.status === 201) {
                //console.log(data);
                //setAlert('d-block alert-success')
                //setError('d-none')
                //msg.innerHTML = json.message;
                //if(path){
                //    publishData()
                //}    
                //load_usulan();
                //setId(0);
                //setName("");
                //setFilename("");
                //setFormVisible(false);
                var reflect = document.getElementById('reflect');
                reflect.innerHTML = "";
                console.log(shapeFile);
                console.log(url_reflect);
                var img = document.createElement('img');
                var refl = url_reflect + shapeFile
                img.src = refl.replace(".shp", "");
                img.addEventListener('load', (event) => {
                    console.log('image has been loaded!');
                    console.log(event);
                    console.log(event.target.width);
                    console.log(event.target.height);
                    fetchGeoserver(event.target.width, event.target.height);
                });
                reflect.append(img);
            } else {
                setError('d-block alert-danger')
                err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }


            // Fetch data from REST API
            /*
            var file = document.getElementById('custom-file'); //document.querySelector("#proposalFile");

            const formData = new FormData();
            formData.append('file', file.files[0]);



            var myHeaders = new Headers(); 
            myHeaders.append("Authorization", auth);
            myHeaders.append("Content-Type", "application/zip");


            /*
             const response = await fetch(url, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/zip'
        },
        body: readStream
      });

            const response = await fetch(this.url + 'about/version.json', {
                credentials: 'include',
                method: 'GET',
                headers: {
                    Authorization: 'Basic ' + auth
                }
            });
            /

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: formData,
                redirect: 'follow'
            };
            /*
            fetch("http://localhost/geoserver/rest/workspaces/cifor/datastores/emhayusa/file.shp", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
                /
            
          
          const requestOptions = {
            method: 'POST',
            headers: { 
                'Authorization': token 
            },
            body: formData
          };
          /
            const response = await fetch(url_upload, requestOptions)
            //console.log(response)

            //var rsp = await response.text();
            //console.log(json);
            //console.log(json.status);

            if (response.status === 201) {
                //console.log(data);
                //setAlert('d-block alert-success')
                //setError('d-none')
                //console.log(response)
                //msg.innerHTML = "successfully uploaded.. wait for get wms url..";
                //load_usulan();
                // setId(0);
                //setName("");
                // setSelectedFile();
                // setAddress("");
                publishData()

            } else {
                setError('d-block alert-danger')
                err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }
            */
        } catch (error) {
            setError('d-block alert-danger')
            msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }

    };

    const publishData = async () => {

        //var btn = document.querySelector("#ulangi");
        var msg = document.querySelector("#message");
        var err = document.querySelector("#error");
        setError('d-block alert-info');
        //console.log(loader);
        err.innerHTML = 'please wait..';

        try {
            const formData = new FormData();
            formData.append('path', path + "/" + shapeFile);
            formData.append('username', username);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: formData
            };

            const response = await fetch(url_publish_data, requestOptions)
            console.log(response)

            //var rsp = await response.text();
            //console.log(json);
            //console.log(json.status);

            if (response.status === 201) {
                //console.log(data);
                //setAlert('d-block alert-success')
                //setError('d-none')
                //console.log(response)
                //msg.innerHTML = "successfully uploaded.. wait for get wms url..";
                //load_usulan();
                // setId(0);
                //setName("");
                //setSelectedFile();
                // setAddress("");
                var reflect = document.getElementById('reflect');
                reflect.innerHTML = "";
                console.log(shapeFile);
                console.log(url_reflect);
                var img = document.createElement('img');
                var refl = url_reflect + shapeFile
                img.src = refl.replace(".shp", "");
                img.addEventListener('load', (event) => {
                    console.log('image has been loaded!');
                    console.log(event);
                    console.log(event.target.width);
                    console.log(event.target.height);
                    fetchGeoserver(event.target.width, event.target.height);
                });
                reflect.append(img);
                //setGeoserverVisible(true);
                //setFormVisible(false);
                //<img src={url_reflect.replace(".shp", "")} />

            } else {
                setError('d-block alert-danger')
                err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }
            /*
            var myHeaders = new Headers(); //YWRtaW46Z2Vvc2VydmVy
            myHeaders.append("Authorization", auth);
            myHeaders.append("Content-Type", "text/plain");
            console.log(path)
            console.log(shapeFile)
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: path + "/" + shapeFile,
                redirect: 'follow'
            };

            const response = await fetch(url_publish_data, requestOptions)
            console.log(response)

            //var rsp = await response.text();
            //console.log(json);
            //console.log(json.status);

            if (response.status === 201) {
                //console.log(data);
                //setAlert('d-block alert-success')
                //setError('d-none')
                //console.log(response)
                //msg.innerHTML = "successfully uploaded.. wait for get wms url..";
                //load_usulan();
                // setId(0);
                //setName("");
                //setSelectedFile();
                // setAddress("");
                var reflect = document.getElementById('reflect');
                reflect.innerHTML = "";
                console.log(shapeFile);
                console.log(url_reflect);
                var img = document.createElement('img');
                var refl = url_reflect + shapeFile
                img.src = refl.replace(".shp", "");
                img.addEventListener('load', (event) => {
                    console.log('image has been loaded!');
                    console.log(event);
                    console.log(event.target.width);
                    console.log(event.target.height);
                    fetchGeoserver(event.target.width, event.target.height);
                });
                reflect.append(img);
                //setGeoserverVisible(true);
                //setFormVisible(false);
                //<img src={url_reflect.replace(".shp", "")} />

            } else {
                setError('d-block alert-danger')
                err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }
            */
        } catch (error) {
            setError('d-block alert-danger')
            msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }

    };


    const fetchGeoserver = async (width, height) => {


        try {

            var myHeaders = new Headers(); //YWRtaW46Z2Vvc2VydmVy
            myHeaders.append("Authorization", auth);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            const response = await fetch(url_featuretypes + "/" + shapeFile.replace(".shp", ".json"), requestOptions)
            //console.log(response)
            var json = await response.json();
            //var rsp = await response.text();
            //console.log(json);
            //console.log(json.status);

            if (response.status === 200) {
                //url_featuretypes
                //http://localhost/geoserver/rest/workspaces/cifor/datastores/emhayusa/featuretypes/TOPONIMI_PT_25K.json
                //shapeFile
                console.log(width);
                console.log(height);
                console.log(json);
                var srs = json.featureType.latLonBoundingBox.crs
                var minx = json.featureType.latLonBoundingBox.minx
                var miny = json.featureType.latLonBoundingBox.miny
                var maxx = json.featureType.latLonBoundingBox.maxx
                var maxy = json.featureType.latLonBoundingBox.maxy
                //Bbox: minx,miny,maxx,maxy
                //http://localhost/geoserver/cifor/wms?service=WMS&version=1.1.0&request=GetMap&layers=cifor:ADMINISTRASIDESA_AR_25K&bbox=110.4633245,-7.14820047,110.8335801,-6.70817701&width=606&height=721&srs=EPSG:4326&styles=&format=image/png
                var url_r = url_wms + shapeFile.replace(".shp", "") + "&bbox=" + minx + "," + miny + "," + maxx + "," + maxy + "&width=" + width + "&height=" + height + "&srs=" + srs + "&styles=&format=image/png"
                setUrl(url_r)
                //setFormVisible(false);
                //setGeoserverVisible(true);
                //console.log(json);
                //console.log(json.featureTypes.featureType);
                //console.log()
                //setTimeout(() => {
                // remove from DOM
                if (modeUsulan === 'tambah')
                    saveData(url_r)
                else
                    updateData(url_r)
                //}, 1000)


            } else {
                // setError('d-block alert-danger')
                //err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }

        } catch (error) {
            //setError('d-block alert-danger')
            //msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }

    };


    const ubahData = async () => {


        //var btn = document.querySelector("#ulangi");
        var msg = document.querySelector("#message");
        var err = document.querySelector("#error");
        setError('d-block alert-info');
        //console.log(loader);
        err.innerHTML = 'please wait..';

        try {
            // Fetch data from REST API

            var file = document.getElementById('custom-file'); //document.querySelector("#proposalFile");
            if (file.files[0]) {
                const formData = new FormData();
                formData.append('file', file.files[0]);
                formData.append('username', username);

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    body: formData
                };

                const response = await fetch(url_update_data, requestOptions)
                //console.log(response)

                var json = await response.json();
                //console.log(json);
                //console.log(json.status);

                if (response.status === 201) {
                    //console.log(data);
                    //setAlert('d-block alert-success')
                    //setError('d-none')
                    //msg.innerHTML = json.message;
                    //if(path){
                    //    publishData()
                    //}    
                    //load_usulan();
                    //setId(0);
                    //setName("");
                    //setFilename("");
                    //setFormVisible(false);
                    var reflect = document.getElementById('reflect');
                    reflect.innerHTML = "";
                    console.log(shapeFile);
                    console.log(url_reflect);
                    var img = document.createElement('img');
                    var refl = url_reflect + shapeFile
                    img.src = refl.replace(".shp", "");
                    img.addEventListener('load', (event) => {
                        console.log('image has been loaded!');
                        console.log(event);
                        console.log(event.target.width);
                        console.log(event.target.height);
                        fetchGeoserver(event.target.width, event.target.height);
                    });
                    reflect.append(img);
                } else {
                    setError('d-block alert-danger')
                    err.innerHTML = `Error ${response.status} ${response.statusText}`;
                    console.error(`Error ${response.status} ${response.statusText}`);
                }


                /*
                const formData = new FormData();
                formData.append('file', file.files[0]);



                var myHeaders = new Headers(); //YWRtaW46Z2Vvc2VydmVy
                myHeaders.append("Authorization", auth);
                myHeaders.append("Content-Type", "application/zip");


                /*
                 const response = await fetch(url, {
            credentials: 'include',
            method: 'PUT',
            headers: {
              Authorization: 'Basic ' + auth,
              'Content-Type': 'application/zip'
            },
            body: readStream
          });
    
                const response = await fetch(this.url + 'about/version.json', {
                    credentials: 'include',
                    method: 'GET',
                    headers: {
                        Authorization: 'Basic ' + auth
                    }
                });
                *

                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: formData,
                    redirect: 'follow'
                };
                /*
                fetch("http://localhost/geoserver/rest/workspaces/cifor/datastores/emhayusa/file.shp", requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                    /
                
              
              const requestOptions = {
                method: 'POST',
                headers: { 
                    'Authorization': token 
                },
                body: formData
              };
              *
                const response = await fetch(url_upload, requestOptions)
                //console.log(response)

                //var rsp = await response.text();
                //console.log(json);
                //console.log(json.status);

                if (response.status === 201) {
                    //console.log(data);
                    //setAlert('d-block alert-success')
                    //setError('d-none')
                    //console.log(response)
                    //msg.innerHTML = "successfully uploaded.. wait for get wms url..";
                    //load_usulan();
                    // setId(0);
                    //setName("");
                    // setSelectedFile();
                    // setAddress("");
                    publishData()

                } else {
                    setError('d-block alert-danger')
                    err.innerHTML = `Error ${response.status} ${response.statusText}`;
                    console.error(`Error ${response.status} ${response.statusText}`);
                }
                */
            } else {
                //update name only
                //alert('execute')
                updateData(url)
            }
        } catch (error) {
            setError('d-block alert-danger')
            msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }

    };

    const hapusData = async () => {

        //var btn = document.querySelector("#ulangi");
        var msg = document.querySelector("#message");
        var err = document.querySelector("#error");
        setError('d-block alert-info');
        //console.log(loader);
        err.innerHTML = 'please wait ..';


        try {

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    "id": id
                })
            };

            const response = await fetch(url_delete, requestOptions)
            //console.log(response)

            var json = await response.json();
            //console.log(json);
            //console.log(json.status);


            //msg.innerHTML = json.data.status;

            if (response.status === 201) {
                //console.log(data);
                setAlert('d-block alert-success')
                setError('d-none')
                msg.innerHTML = json.message;
                load_usulan();
                setId(0);
                setName("");
                setAddress("");
                setFormVisible(false);
            } else {
                setError('d-block alert-danger')
                err.innerHTML = `Error ${response.status} ${response.statusText}`;
                console.error(`Error ${response.status} ${response.statusText}`);
            }

        } catch (error) {
            setError('d-block alert-danger')
            msg.innerHTML = `Error ${error}`;
            console.error(`Error ${error}`);
        }

    };

    function handleSubmit(event) {
        event.preventDefault();
        if (modeUsulan === 'tambah')
            tambahData();
        else if (modeUsulan === 'ubah')
            ubahData();
        else if (modeUsulan === 'hapus')
            hapusData();
    }


    function handleSubmitData(event) {
        event.preventDefault();
        saveData();
    }


    function muatUlang(event) {
        window.location.reload();
    }


    useEffect(() => {

        let mounted = true;

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        };

        fetch(url_list, requestOptions).then(res => res.json()).then(data => {
            if (mounted) {
                setloading(false)
                if (data.status === "Expired token") {
                    //console.log("aaa")
                    //props.setLogout()
                    window.location.replace(Config.base_domain)
                } else {
                    setItems(data.data);
                }
            }
        })

        return function cleanup() {
            mounted = false;
        }
    }, [token, url_list]);



    const loader = <img className="logo d-inline" alt="logo" src={image_loader} width="30px" />
    const card = (
        <>
            <Card className={tabel}>
                <Card.Body>
                    <Alert variant="warning">
                        <span className="text-uppercase"><b>List of uploaded data</b></span>
                    </Alert>
                    <Table bordered className="font-11" size="sm">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th width="15%">Data Name</th>
                                <th width="20%">File Name</th>
                                <th width="15%">Time Uploaded</th>
                                <th width="35%" >Geoserver WMS URL</th>
                                <th width="10%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                getRowsData()
                            }
                        </tbody>
                    </Table>

                    <Alert className={alert}>
                        <span id="message">pesan</span>
                        <button type="button" className="close" aria-label="Close" onClick={() => setAlert('d-none')}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Alert>
                    <Form.Group>
                        <Button variant="success" type="button" block onClick={() => setModeInsert()} className="font-11 py-0" size="sm">Add a new dataset</Button>
                    </Form.Group>

                </Card.Body>
            </Card>
            <Card className={status} id="#form_isian">
                <Card.Body>
                    <Alert variant="warning">
                        <span className="text-uppercase"><b>Data form</b></span>
                    </Alert>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Server</Form.Label>
                            <Form.Control size="sm" className="font-11" type="text" value={Config.geoserver_domain} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Workspace</Form.Label>
                            <Form.Control size="sm" className="font-11" type="text" value="fta" disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Store</Form.Label>
                            <Form.Control size="sm" className="font-11" type="text" value={username} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>WMS URL</Form.Label>
                            <Form.Control size="sm" className="font-11" type="text" value={url} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Data Name</Form.Label>
                            <Form.Control size="sm" className="font-11" type="text" value={name} onChange={e => setName(e.target.value)} disabled={modeUsulan === "hapus"} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Upload File (Shapefile.zip)</Form.Label>
                            <Form.File
                                id="custom-file"
                                label="Upload file"
                                custom
                                onChange={(e) => onFileChange(e)}
                                disabled={modeUsulan === "hapus"}
                            />
                        </Form.Group>
                        <div id="list"></div>

                        <Alert className={error}>
                            <span id="error" className="font-11">message</span>
                            <button type="button" className="close pt-0" aria-label="Close" onClick={() => setError('d-none')}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </Alert>

                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <Button variant="danger" type="button" block onClick={() => setFormVisible(false)} className="font-11 py-0" size="sm" >Cancel</Button>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Button variant="success" type="submit" block disabled={!validateForm()} className="font-11 py-0" size="sm" title="Data name and Upload File must be inserted">{tombolUsulan} Data</Button>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Form>
                    <div id="reflect"></div>
                </Card.Body>
            </Card>
            <Card className={status_wms} id="#form_wms">
                <Card.Body>
                    <Alert variant="warning">
                        <span className="text-uppercase"><b>Geoserver Response</b></span>
                    </Alert>
                    <Form onSubmit={handleSubmitData}>

                        <Form.Row>
                            <Col>
                                <Form.Group>
                                    <Button variant="danger" type="button" block onClick={() => setGeoserverVisible(false)} className="font-11 py-0" size="sm" >Cancel</Button>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Button variant="success" type="submit" block className="font-11 py-0" size="sm">Save Data</Button>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                    </Form>



                </Card.Body>
            </Card>
        </>

    )
    return loading ? loader : card
}

/*

<Button variant="success" type="submit" className="float-right mb-2"  onClick={()=>unduhExcel()} > <FileEarmarkExcel size={16}/> Unduh Usulan Excel</Button>
        <Button variant="primary" type="submit" className="float-right mb-2 mr-2"  onClick={()=>cetakUsulan()} > <Download size={16}/> Unduh Usulan Pdf</Button>
        <Button variant="info" type="submit" className="float-right mb-2 mr-2"  onClick={()=>muatUlang()} > <ArrowRepeat size={16}/> Muat Ulang Usulan</Button>

        */