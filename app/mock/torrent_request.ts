export var SingleFileTorrentRequest = {
  "files_tree": {
    "contents": {
      "ubuntu-15.10-desktop-amd64.iso": {
        "download": true,
        "index": 0,
        "length": 1178386432,
        "type": "file"
      }
    }
  },
  "name": "ubuntu-15.10-desktop-amd64.iso",
  "info_hash": "3f19b149f53a50e14fc0b79926a391896eabab6f"
}

export var MultiFileTorrentRequest = {
  "files_tree": {
    "type": "dir",
    "contents": {
      "KNOPPIX_V7.6.0DVD-2015-11-21-EN": {
        "download": true,
        "length": 4372948775,
        "type": "dir",
        "contents": {
          "test_directory": {
            "type": "dir",
            "download": true,
            "contents": {
              "test_file": {
                "download": true,
                "path": "test_directory/testfile",
                "length": 78,
                "type": "file",
                "index": 7
              }
            }
          },
          "KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.sha1": {
            "download": true,
            "path": "KNOPPIX_V7.6.0DVD-2015-11-21-EN/KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.sha1",
            "length": 78,
            "type": "file",
            "index": 3
          },
          "dpkg-l-dvd-760.txt": {
            "download": true,
            "path": "KNOPPIX_V7.6.0DVD-2015-11-21-EN/dpkg-l-dvd-760.txt",
            "length": 562399,
            "type": "file",
            "index": 5
          },
          "KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.md5.asc": {
            "download": true,
            "path": "KNOPPIX_V7.6.0DVD-2015-11-21-EN/KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.md5.asc",
            "length": 298,
            "type": "file",
            "index": 2
          },
          "knoppix-cheatcodes.txt": {
            "download": true,
            "path": "KNOPPIX_V7.6.0DVD-2015-11-21-EN/knoppix-cheatcodes.txt",
            "length": 10072,
            "type": "file",
            "index": 6
          },
          "KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.md5": {
            "download": true,
            "path": "KNOPPIX_V7.6.0DVD-2015-11-21-EN/KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.md5",
            "length": 70,
            "type": "file",
            "index": 1
          },
          "KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso": {
            "download": true,
            "path": "KNOPPIX_V7.6.0DVD-2015-11-21-EN/KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso",
            "length": 4372375552,
            "type": "file",
            "index": 0
          },
          "KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.sha1.asc": {
            "download": true,
            "path": "KNOPPIX_V7.6.0DVD-2015-11-21-EN/KNOPPIX_V7.6.0DVD-2015-11-21-EN.iso.sha1.asc",
            "length": 306,
            "type": "file",
            "index": 4
          }
        }
      }
    }
  },
  "name": "KNOPPIX_V7.6.0DVD-2015-11-21-EN",
  "info_hash": "7b05ab9de5dba8ce3472ce776617dc741788b6d9"
}

export var MagnetTorrentRequest = {
  "files_tree": "",
  "name": "ubuntu-15.10-desktop-amd64.iso",
  "info_hash": "3f19b149f53a50e14fc0b79926a391896eabab6f",
}

export var FileFolderTorrentRequest = {
  "files_tree": {
    "contents": {
      "Test.file": {
        "download": true,
        "index": 31522526,
        "path": "Test.file",
        "length": 306,
        "type": "file",
      }
    },
    "type": "dir",
  },
  "name": "testingFolder",
  "info_hash": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
}

