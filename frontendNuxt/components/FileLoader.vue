<template>
    <div>
        <input type="file" @change="loadAgent()" ref="loaderInput" />
    </div>
</template>

<script setup lang="ts">
const loaderInput = ref();

const validFileTypes = ['application/json'];

async function loadAgent() {
    const files: File[] = loaderInput.value.files;

    for (const file of files) {
        if (isValidFileType(file)) {
            const content = await readJSONFile(file);
            console.log(content);
        }
    }
}

async function readJSONFile(file: File): Promise<string> {
    var fileReader = new FileReader();
    fileReader.readAsText(file);
    let res: string = await new Promise<string>((resolve) => {
        let result = '';
        fileReader.onload = (evt: any) => {
            result += evt.target.result;
        };
        fileReader.onloadend = () => {
            resolve(result);
        };
    });
    return res;
}

function isValidFileType(file: File) {
    return validFileTypes.includes(file.type);
}
</script>

<style scoped></style>
