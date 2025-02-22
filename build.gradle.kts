/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

plugins {
  id("io.github.gradle-nexus.publish-plugin") version "1.1.0"
  id("com.android.library") version "7.4.2" apply false
  id("com.android.application") version "7.4.2" apply false
  id("de.undercouch.download") version "5.0.1" apply false
  kotlin("android") version "1.7.22" apply false
}

val reactAndroidProperties = java.util.Properties()

File("$rootDir/packages/react-native/ReactAndroid/gradle.properties").inputStream().use {
  reactAndroidProperties.load(it)
}

version =
    if (project.hasProperty("isNightly") &&
        (project.property("isNightly") as? String).toBoolean()) {
      "${reactAndroidProperties.getProperty("VERSION_NAME")}-SNAPSHOT"
    } else {
      reactAndroidProperties.getProperty("VERSION_NAME")
    }

group = "com.facebook.react"

val ndkPath by extra(System.getenv("ANDROID_NDK"))
val ndkVersion by extra(System.getenv("ANDROID_NDK_VERSION"))
val sonatypeUsername = findProperty("SONATYPE_USERNAME")?.toString()
val sonatypePassword = findProperty("SONATYPE_PASSWORD")?.toString()

nexusPublishing {
  repositories {
    sonatype {
      username.set(sonatypeUsername)
      password.set(sonatypePassword)
    }
  }
}

tasks.register("cleanAll", Delete::class.java) {
  description = "Remove all the build files and intermediate build outputs"
  dependsOn(gradle.includedBuild("react-native-gradle-plugin").task(":clean"))
  dependsOn(":packages:react-native:ReactAndroid:clean")
  dependsOn(":packages:react-native:ReactAndroid:hermes-engine:clean")
  dependsOn(":packages:rn-tester:android:app:clean")
  delete(allprojects.map { it.buildDir })
  delete(rootProject.file("./packages/react-native/ReactAndroid/.cxx"))
  delete(rootProject.file("./packages/react-native/ReactAndroid/hermes-engine/.cxx"))
  delete(rootProject.file("./packages/react-native/sdks/download/"))
  delete(rootProject.file("./packages/react-native/sdks/hermes/"))
  delete(
      rootProject.file("./packages/react-native/ReactAndroid/src/main/jni/prebuilt/lib/arm64-v8a/"))
  delete(
      rootProject.file(
          "./packages/react-native/ReactAndroid/src/main/jni/prebuilt/lib/armeabi-v7a/"))
  delete(rootProject.file("./packages/react-native/ReactAndroid/src/main/jni/prebuilt/lib/x86/"))
  delete(rootProject.file("./packages/react-native/ReactAndroid/src/main/jni/prebuilt/lib/x86_64/"))
  delete(rootProject.file("./packages/react-native-codegen/lib"))
  delete(rootProject.file("./packages/rn-tester/android/app/.cxx"))
}

tasks.register("buildAll") {
  description = "Build and test all the React Native relevant projects."
  dependsOn(gradle.includedBuild("react-native-gradle-plugin").task(":build"))
  // This builds both the React Native framework for both debug and release
  dependsOn(":packages:react-native:ReactAndroid:assemble")
  // This creates all the Maven artifacts and makes them available in the /android folder
  dependsOn(":packages:react-native:ReactAndroid:installArchives")
  // This builds RN Tester for Hermes/JSC for debug and release
  dependsOn(":packages:rn-tester:android:app:assemble")
  // This compiles the Unit Test sources (without running them as they're partially broken)
  dependsOn(":packages:react-native:ReactAndroid:compileDebugUnitTestSources")
  dependsOn(":packages:react-native:ReactAndroid:compileReleaseUnitTestSources")
}

tasks.register("downloadAll") {
  description = "Download all the depedencies needed locally so they can be cached on CI."
  dependsOn(gradle.includedBuild("react-native-gradle-plugin").task(":dependencies"))
  dependsOn(":packages:react-native:ReactAndroid:downloadNdkBuildDependencies")
  dependsOn(":packages:react-native:ReactAndroid:dependencies")
  dependsOn(":packages:react-native:ReactAndroid:androidDependencies")
  dependsOn(":packages:react-native:ReactAndroid:hermes-engine:dependencies")
  dependsOn(":packages:react-native:ReactAndroid:hermes-engine:androidDependencies")
  dependsOn(":packages:rn-tester:android:app:dependencies")
  dependsOn(":packages:rn-tester:android:app:androidDependencies")
}

tasks.register("publishAllInsideNpmPackage") {
  description =
      "Publish all the artifacts to be available inside the NPM package in the `android` folder."
  // Due to size constraints of NPM, we publish only react-native and hermes-engine inside
  // the NPM package.
  dependsOn(":packages:react-native:ReactAndroid:installArchives")
  dependsOn(":packages:react-native:ReactAndroid:hermes-engine:installArchives")
}

tasks.register("publishAllToMavenTempLocal") {
  description = "Publish all the artifacts to be available inside a Maven Local repository on /tmp."
  dependsOn(":packages:react-native:ReactAndroid:publishAllPublicationsToMavenTempLocalRepository")
  // We don't publish the external-artifacts to Maven Local as CircleCI is using it via workspace.
  dependsOn(
      ":packages:react-native:ReactAndroid:hermes-engine:publishAllPublicationsToMavenTempLocalRepository")
}

tasks.register("publishAllToSonatype") {
  description = "Publish all the artifacts to Sonatype (Maven Central or Snapshot repository)"
  dependsOn(":packages:react-native:ReactAndroid:publishToSonatype")
  dependsOn(":packages:react-native:ReactAndroid:external-artifacts:publishToSonatype")
  dependsOn(":packages:react-native:ReactAndroid:hermes-engine:publishToSonatype")
}
