/*
  ピン
*/
import Movable from "./movable.js"

// create a pin
function loadJson() {
  var jsonobj = 
  {
    "metadata": {
      "version": 4.5,
      "type": "Object",
      "generator": "Object3D.toJSON"
    },
		"geometries": 
		[
      {
        "uuid": "C507E6D4-EA6A-4F57-BDD5-605CFC5785BC",
        "type": "SphereBufferGeometry",
        "radius": 1,
        "widthSegments": 32,
        "heightSegments": 16,
        "phiStart": 0,
        "phiLength": 6.283185,
        "thetaStart": 0,
        "thetaLength": 3.141593
      },
      {
        "uuid": "A61FD6B3-F839-47C7-AD6B-9D5A315A1DE6",
        "type": "CylinderBufferGeometry",
        "radiusTop": 1,
        "radiusBottom": 0,
        "height": 2,
        "radialSegments": 32,
        "heightSegments": 1,
        "openEnded": false
      },
      {
        "uuid": "40EA369E-5851-47C5-AF00-61749FADF2B7",
        "type": "SphereBufferGeometry",
        "radius": 1,
        "widthSegments": 32,
        "heightSegments": 16,
        "phiStart": 0,
        "phiLength": 6.283185,
        "thetaStart": 0,
        "thetaLength": 3.141593
			}
		],
		"materials":
		[
      {
        "uuid": "8E73D23A-D636-4E11-B685-DCFB47AD0FD0",
        "type": "MeshLambertMaterial",
        "color": 197379,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false,
        "dithering": false
      },
      {
        "uuid": "88520194-9788-4DAF-B6FD-6BE274E14BA7",
        "type": "MeshLambertMaterial",
        "color": 510190,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false,
        "dithering": false
      },
      {
        "uuid": "94AF5EDB-0D0D-41A4-BF52-757696683E5F",
        "type": "MeshLambertMaterial",
        "color": 16248578,
        "emissive": 0,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "skinning": false,
        "morphTargets": false,
        "dithering": false
			}
		],
		"object":
		{
      "uuid": "3A4436A2-E212-449D-9C06-BBC7D5B03D4A",
      "type": "Group",
      "name": "Group 1",
      "castShadow": true,
      "receiveShadow": false,
      "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1],
			"children":
			[
        {
          "uuid": "9D4AAD1F-7487-4E1B-BF36-C4087042B418",
          "type": "Mesh",
          "name": "Sphere 1",
          "matrix": [0.2,0,0,0,0,0.2,0,0,0,0,0.2,0,0.744314,6.425803,1.095651,1],
          "geometry": "C507E6D4-EA6A-4F57-BDD5-605CFC5785BC",
          "material": "8E73D23A-D636-4E11-B685-DCFB47AD0FD0"
        },
        {
          "uuid": "BF15D2A5-E1AD-40A4-B80D-E03496BDA7C3",
          "type": "Mesh",
          "name": "PinCylinder",
          "castShadow": true,
          "receiveShadow": false,
          "matrix": [2,0,0,0,0,3,0,0,0,0,2,0,0,2,0,1],
          "geometry": "A61FD6B3-F839-47C7-AD6B-9D5A315A1DE6",
          "material": "88520194-9788-4DAF-B6FD-6BE274E14BA7"
        },
        {
          "uuid": "51169206-4CA1-4966-B061-88BD8DB4D2BD",
          "type": "Mesh",
          "name": "Sphere 3",
          "castShadow": true,
          "receiveShadow": false,
          "matrix": [1.5,0,0,0,0,1.5,0,0,0,0,1.5,0,0,6.260093,0,1],
          "geometry": "40EA369E-5851-47C5-AF00-61749FADF2B7",
          "material": "94AF5EDB-0D0D-41A4-BF52-757696683E5F"
        },
        {
          "uuid": "E988CC3D-B772-4E49-B8F4-87D972C47B12",
          "type": "Mesh",
          "name": "Sphere 1",
          "matrix": [0.2,0,0,0,0,0.2,0,0,0,0,0.2,0,-0.431375,6.431071,1.250825,1],
          "geometry": "C507E6D4-EA6A-4F57-BDD5-605CFC5785BC",
          "material": "8E73D23A-D636-4E11-B685-DCFB47AD0FD0"
				}
			]
    }
  }
  var loader = new THREE.ObjectLoader();
  return loader.parse(jsonobj);
}

class Pin extends Movable {
  constructor(color) {
    super();
    if ( color === undefined ) color = 0xffff00;
    this.mesh = loadJson();
    this.colordMesh = this.mesh.getObjectByName("PinCylinder");
    this.add( this.mesh );
    this.mesh.castShadow = true;
  }
  // 色を変える
  setColor ( color ) {
    this.colordMesh.material.color.set( color );
  };
}

export default Pin;

