Pod::Spec.new do |s|
  s.name           = 'Integrity'
  s.version        = '1.0.0'
  s.summary        = 'Wrapper for DeviceCheck'
  s.description    = 'Wrapper for DeviceCheck'
  s.author         = 'Zondax'
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
