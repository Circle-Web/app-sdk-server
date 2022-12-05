<script lang="ts" setup>
  import {
    reactive,
    ref
  } from 'vue';
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElMessage,
    ElUpload,
    ElIcon,
    type FormInstance,
    UploadUserFile
  } from 'element-plus';
  import {
    Plus
  } from '@element-plus/icons-vue'
  import {
    registerApp
  } from '@/api/app';
  import {
    createQiniuUploader
  } from '@/api/qiniu'


  const formRef = ref < FormInstance > ()

  // create reative state form
  const form = reactive({
    extName: "",
    extDescription: "",
    extMainUrl: "",
    extSetting: "",
    extLogo: "",
  });

  const loading = ref(false);

  /**
   * validate url 
   * support localhost and ip
   */
  const validateUrl = (value: string) => {
    const reg = /^(http|https):\/\/([\w.]+\/?)\S*/;
    return reg.test(value)
  }

  /**
   * create rules
   */
  const rules = {
    extName: [{
      required: true,
      message: "请输入应用名称",
      trigger: "blur"
    }],
    extDescription: [{
      required: true,
      message: "请输入应用描述",
      trigger: "blur"
    }],
    extMainUrl: [{
        required: true,
        message: "请输入应用入口地址",
        trigger: "blur"
      },
      {
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (validateUrl(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的应用入口地址"));
          }
        }
      }
    ],
  }

  const emits = defineEmits(['close'])

  /**
   * create onSubmit function
   */
  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        loading.value = true;
        registerApp(form).then(() => {
          ElMessage.success('创建成功')
          emits('close')
        }).catch((error) => {
          ElMessage.error(`创建失败: ${error.message || error.err}`)
        }).finally(() => {
          loading.value = false;
        })
      } else {
        return false;
      }
    });
  }

  /**
   * create onCancel function
   */
  const onCancel = () => {
    emits('close')
  }

  const fileList = ref < UploadUserFile[] > ()

  const onFileChange = (file) => {
    createQiniuUploader(file.raw).then((fileUrl) => {
      form.extLogo = fileUrl
    })
  }

</script>

<template>
  <div class="add">

    <ElForm :model="form" :rules="rules" ref="formRef" label-width="100px">
      <ElFormItem label="应用名字" prop="extName">
        <ElInput v-model="form.extName" />
      </ElFormItem>
      <ElFormItem label="应用地址" prop="extMainUrl">
        <ElInput v-model="form.extMainUrl" />
      </ElFormItem>
      <ElFormItem label="应用配置" prop="extSetting" :required="false">
        <ElInput v-model="form.extSetting" />
      </ElFormItem>
      <ElFormItem label="应用描述" prop="extDescription">
        <ElInput v-model="form.extDescription" :autosize="{ minRows: 3, maxRows: 4 }" type="textarea" resize="none" />
      </ElFormItem>
      <ElFormItem label="应用描述" prop="file">
        <ElUpload action="#" list-type="picture-card" :auto-upload="false" :limit="1" :on-change="onFileChange"
          v-model:file-list="fileList">
          <ElIcon>
            <Plus />
          </ElIcon>
        </ElUpload>
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="onCancel">取消</ElButton>
        <ElButton type="primary" @click="onSubmit" :loading="loading">提交</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>
